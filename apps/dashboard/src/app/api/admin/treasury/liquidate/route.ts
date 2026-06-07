import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import crypto from 'crypto';

const bodySchema = z.object({
  propertyId: z.string().uuid(),
  quantity: z.number().positive(),
  pricePerToken: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Parámetros inválidos', details: result.error }, { status: 400 });

    const { propertyId, quantity, pricePerToken } = result.data;

    // Ejecutamos la liquidación de Bóveda Central a Mercado
    await db.transaction(async (tx) => {
      // 1. Obtener la bóveda
      const vault = await tx.query.treasury_vaults.findFirst({
        where: eq(schema.treasury_vaults.propertyId, propertyId)
      });

      if (!vault) throw new Error('Bóveda de Tesorería no encontrada para esta propiedad');
      if (parseFloat(vault.availableTokens) < quantity) {
        throw new Error('La Bóveda no tiene suficientes tokens líquidos para ofertar');
      }

      // 2. Bloquear tokens en la bóveda (disminuir available, aumentar locked o enviarlos al escrow_vault)
      await tx.update(schema.treasury_vaults)
        .set({
          availableTokens: sql`${schema.treasury_vaults.availableTokens} - ${quantity}`,
          lockedTokens: sql`${schema.treasury_vaults.lockedTokens} + ${quantity}`,
        })
        .where(eq(schema.treasury_vaults.id, vault.id));

      // 3. Identificar el usuario "Tesorería" o crear una orden a nombre de la empresa
      // Como el esquema p2p_orders requiere un sellerInvestorId, usaremos el primer admin 
      // o un usuario de sistema. Por ahora, buscaremos un admin.
      const admin = await tx.query.users.findFirst({
        where: eq(schema.users.role, 'admin')
      });
      if (!admin) throw new Error('No se encontró cuenta de Tesorería (admin)');

      // 4. Crear la orden P2P institucional
      const totalAmount = quantity * pricePerToken;
      const orderId = crypto.randomUUID();
      
      await tx.insert(schema.p2pOrders).values({
        id: orderId,
        sellerInvestorId: admin.id,
        propertyId,
        quantity: quantity.toString(),
        pricePerToken: pricePerToken.toString(),
        totalAmount: totalAmount.toString(),
        status: 'open',
        isDemo: false,
      });

      // 5. Auditoría Institucional
      await tx.insert(schema.auditLogs).values({
        action: 'VAULT_LIQUIDATION_ORDER',
        details: `Bóveda Central listó ${quantity} fracciones a $${pricePerToken} c/u en el P2P. Total esperado: $${totalAmount}`,
      });
    });

    return NextResponse.json({ success: true, message: `Bóveda Central ha ofertado tokens en el mercado exitosamente` });
  } catch (error) {
    console.error("[Treasury Liquidation]", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
