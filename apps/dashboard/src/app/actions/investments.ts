'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { db } from '@/server/db';
import { usersIdentity } from '@pachanova/database';
import { eq } from 'drizzle-orm';

export async function processFiatInvestment(formData: FormData) {
  try {
    const amount = formData.get('amount');
    const trustId = formData.get('trustId');

    if (!amount || !trustId) {
      return { success: false, message: 'Faltan datos obligatorios (monto o fideicomiso).' };
    }

    // a) Verificación de Sesión
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, message: 'No autorizado. Por favor, inicia sesión.' };
    }

    // b) Verificación de Identidad (KYC)
    const identityRecord = await db.query.usersIdentity.findFirst({
      where: eq(usersIdentity.userId, user.id)
    });

    if (!identityRecord) {
      return { success: false, message: 'Registro de identidad no encontrado.' };
    }

    if (identityRecord.kycStatus !== 'approved') {
      return { success: false, message: 'KYC pendiente o rechazado. Aprobación requerida para invertir.' };
    }

    // c) Account Abstraction (Simulación de creación de "Smart Wallet")
    let smartWallet = identityRecord.smartWalletAddress;
    
    if (!smartWallet) {
      /* MOCK: Llamada a proveedor de Account Abstraction (ej. Privy, Web3Auth)
        const newWallet = await privyClient.createWallet({ userId: user.id });
        smartWallet = newWallet.address;
      */
      
      // Generando una dirección simulada para el flujo de prueba
      smartWallet = '0x' + Array(40).fill('0').join(''); 
      
      // Actualizamos la base de datos con la nueva billetera abstracta
      await db.update(usersIdentity)
        .set({ smartWalletAddress: smartWallet })
        .where(eq(usersIdentity.userId, user.id));
        
      console.log(`[Account Abstraction] Billetera EVM generada en background: ${smartWallet}`);
    }

    // d) Pasarela Fiat (Procesamiento bajo "Aporte a Fideicomiso")
    /* MOCK: Integración de Stripe o MercadoPago
      Concepto Legal inamovible: "Aporte a Fideicomiso" (Evita bloqueos por venta de criptomonedas)
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100, // Conversión a centavos
        currency: 'usd',
        description: `Aporte a Fideicomiso - TrustID: ${trustId}`,
        metadata: { userId: user.id, smartWallet }
      });
      
      // En un flujo real, aquí retornaríamos el client_secret al frontend para capturar el pago.
      // Para este Server Action, asumimos que la confirmación del pago fue exitosa.
    */
    console.log(`[Fiat Gateway] Pago fiat procesado exitosamente por $${amount}.`);

    // e) Comunicación Interna (Llamada al orquestador Hono para mintear/asignar ERC-3643)
    const honoEndpoint = `${process.env.INTERNAL_API_URL}/api/webhooks/investment-success`;
    
    const backendResponse = await fetch(honoEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}` // Autenticación servidor a servidor
      },
      body: JSON.stringify({
        userId: user.id,
        trustId: trustId.toString(),
        amount: Number(amount),
        smartWallet: smartWallet
      })
    });

    if (!backendResponse.ok) {
      throw new Error('Fallo en la sincronización blockchain con el servidor orquestador.');
    }

    return { 
      success: true, 
      message: 'Inversión procesada con éxito. Los derechos fiduciarios se reflejarán en tu panel pronto.' 
    };

  } catch (error: any) {
    console.error('[processFiatInvestment Error]:', error);
    return { 
      success: false, 
      message: 'Ocurrió un error crítico al procesar la inversión.', 
      error: error.message || error 
    };
  }
}
