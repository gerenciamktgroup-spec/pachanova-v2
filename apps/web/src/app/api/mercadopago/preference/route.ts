import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { MercadoPagoSandboxProvider, createIntegrationRegistry } from '@pachanova/integrations';
import { z } from 'zod';

const requestSchema = z.object({
  investorId: z.string().uuid(),
  quantity: z.number().int().min(1).max(50000), // Max Genesis allocation is 50,000
});

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') {
      return NextResponse.json({ success: false, error: 'DEMO_MODE=true required for this route' }, { status: 403 });
    }
    if (process.env.DEMO_PROFILE !== 'sandbox') {
      return NextResponse.json({ success: false, error: 'DEMO_PROFILE=sandbox required for this route' }, { status: 403 });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
    if (!accessToken.startsWith('TEST_') || accessToken.startsWith('APP_USR')) {
      return NextResponse.json({ success: false, error: 'Sandbox requires TEST_ access token' }, { status: 403 });
    }

    const body = await req.json();
    const result = requestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Invalid parameters', details: result.error }, { status: 400 });
    }

    const { investorId, quantity } = result.data;

    // Check KYC status
    const user = await db.query.investors.findFirst({
      where: eq(schema.investors.id, investorId)
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (user.kycStatus === 'pending') {
      return NextResponse.json({ success: false, error: 'User KYC is pending. Cannot create order.' }, { status: 403 });
    }

    const pricePerToken = 8.40; // Preventa fijo
    const orderId = crypto.randomUUID();

    const property = await db.query.properties.findFirst();
    if (!property) return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });

    // 1. Integrations Check
    const registry = createIntegrationRegistry();
    const paymentsStatus = registry.getStatus('payments');

    if (paymentsStatus.status === 'PENDING_CREDENTIALS') {
      return NextResponse.json({ success: false, error: 'MercadoPago is active but pending real credentials' }, { status: 503 });
    }

    if (paymentsStatus.status === 'DISABLED') {
      return NextResponse.json({ success: false, error: 'Payments are disabled' }, { status: 400 });
    }

    // 2. Create order in database
    await db.insert(schema.tokenOrders).values({
      id: orderId,
      investorId: investorId,
      propertyId: property.id,
      quantity: quantity.toString(),
      unitPrice: pricePerToken.toString(),
      totalAmount: (quantity * pricePerToken).toString(),
      status: 'pending'
    });

    // 3. Simulated vs Real
    let preferenceData = { id: `sim_${orderId}`, init_point: `/dashboard?simulated_payment=true&order=${orderId}` };

    if (!paymentsStatus.simulated && paymentsStatus.status === 'CONNECTED') {
       // Call MercadoPago Sandbox
       const provider = new MercadoPagoSandboxProvider(accessToken, process.env.MERCADOPAGO_WEBHOOK_SECRET || '');
       
       try {
         const mpData = await provider.createPreference({
           orderId,
           investorId: investorId,
           quantity,
           unitPrice: pricePerToken,
           metadata: {
             orderId,
             investorId: investorId,
             quantity,
             unitPrice: pricePerToken,
             totalAmount: quantity * pricePerToken,
             demoMode: true
           }
         });
         preferenceData = { id: mpData.id, init_point: mpData.init_point! };
       } catch (mpError: unknown) {
         console.error("MercadoPago API Error:", (mpError as Error).message);
         return NextResponse.json({ success: false, error: 'Failed to communicate with MercadoPago API', message: (mpError as Error).message }, { status: 502 });
       }
    }

    // 4. Update order with preference ID
    await db.update(schema.tokenOrders)
      .set({ preferenceId: preferenceData.id })
      .where(eq(schema.tokenOrders.id, orderId));

    // 5. Audit & Integration Event
    await db.insert(schema.auditLogs).values({
      action: 'PREFERENCE_CREATED',
      details: `Created MercadoPago preference ${preferenceData.id} for order ${orderId}`
    });

    await db.insert(schema.integrationEvents).values({
      provider: 'MERCADOPAGO',
      eventType: 'PREFERENCE_CREATED',
      payload: { orderId, preferenceId: preferenceData.id },
      simulated: paymentsStatus.simulated
    });

    return NextResponse.json({ success: true, preferenceId: preferenceData.id, initPoint: preferenceData.init_point, orderId });
  } catch (error: unknown) {
    console.error('Error creando preferencia MP:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
