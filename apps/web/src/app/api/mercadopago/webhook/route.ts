import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { MercadoPagoSandboxProvider, createIntegrationRegistry } from '@pachanova/integrations';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch(e) {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }
    const { type, data, action } = body;
    
    // Convert Headers to Record<string, string>
    const headersRecord: Record<string, string> = {};
    req.headers.forEach((value, key) => { headersRecord[key] = value; });

    const registry = createIntegrationRegistry();
    const paymentsStatus = registry.getStatus('payments');

    if (paymentsStatus.status === 'DISABLED') {
      return NextResponse.json({ success: false, error: 'Payments are disabled' }, { status: 400 });
    }

    const allowUnsigned = process.env.DEMO_PROFILE !== 'sandbox' && process.env.MP_WEBHOOK_ALLOW_UNSIGNED === 'true';
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET || '';
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';

    const provider = new MercadoPagoSandboxProvider(accessToken, secret, allowUnsigned);
    
    if (process.env.DEMO_PROFILE === 'sandbox' && (!headersRecord['x-signature'] || !headersRecord['x-request-id'])) {
       try {
         await db.insert(schema.integrationEvents).values({
           provider: 'MERCADOPAGO',
           eventType: 'WEBHOOK_SIGNATURE_INVALID',
           payload: { headers: headersRecord },
           simulated: paymentsStatus.simulated
         });
       } catch (e) {
         console.warn("DB telemetry failed for Missing signature headers", e);
       }
       return NextResponse.json({ success: false, error: 'Missing signature headers' }, { status: 401 });
    }

    const isValid = provider.verifyWebhookSignature(headersRecord, rawBody);

    if (!isValid) {
      try {
        await db.insert(schema.integrationEvents).values({
          provider: 'MERCADOPAGO',
          eventType: 'WEBHOOK_SIGNATURE_INVALID',
          payload: { headers: headersRecord, error: 'Signature mismatch' },
          simulated: paymentsStatus.simulated
        });
      } catch (e) {
        console.warn("DB telemetry failed for Invalid Signature", e);
      }
      return NextResponse.json({ success: false, error: 'Invalid Signature' }, { status: 401 });
    }

    await db.insert(schema.integrationEvents).values({
      provider: 'MERCADOPAGO',
      eventType: 'WEBHOOK_RECEIVED',
      payload: body,
      simulated: paymentsStatus.simulated
    });

    if (type === 'payment' || action?.startsWith('payment.')) {
      const paymentId = data?.id;
      if (!paymentId) return NextResponse.json({ success: false, error: 'Missing payment id' }, { status: 400 });

      // Verificar idempotencia (duplicate)
      const existingPurchase = await db.query.genesisPurchases.findFirst({
        where: eq(schema.genesisPurchases.paymentReference, paymentId.toString())
      });

      if (existingPurchase) {
        await db.insert(schema.integrationEvents).values({
          provider: 'MERCADOPAGO',
          eventType: 'PAYMENT_DUPLICATE',
          payload: { paymentId },
          simulated: false
        });
        return NextResponse.json({ success: true, message: 'idempotent_duplicate' }, { status: 200 });
      }

      // Check real payment details from MP
      let status = 'approved'; 
      let external_reference = '';
      let transaction_amount = 0;
      let currency_id = 'USD';
      const expectedCurrency = process.env.MERCADOPAGO_CURRENCY || 'USD';

      if (process.env.DEMO_PROFILE === 'sandbox') {
         try {
           const details = await provider.getPaymentDetails(paymentId.toString());
           status = details.status || 'pending';
           external_reference = details.external_reference || '';
           transaction_amount = details.transaction_amount || 0;
           currency_id = details.currency_id || 'USD';
         } catch (parseError: unknown) {
           console.error("Failed to fetch payment details from MP", parseError);
           return NextResponse.json({ success: false, error: 'Failed to verify payment with MP' }, { status: 502 });
         }
      } else {
         // Mocking logic para tests
         external_reference = body.data?.external_reference || 'mock-order-id';
         transaction_amount = body.data?.transaction_amount || 0;
         status = body.data?.status || 'approved';
         currency_id = body.data?.currency_id || expectedCurrency;
      }

      if (status !== 'approved') {
        await db.insert(schema.integrationEvents).values({
          provider: 'MERCADOPAGO',
          eventType: 'PAYMENT_REJECTED',
          payload: { paymentId, status },
          simulated: false
        });
        return NextResponse.json({ success: true, message: `Payment ${status}` }, { status: 200 });
      }

      if (!external_reference) {
         return NextResponse.json({ success: false, error: 'Missing external_reference' }, { status: 400 });
      }

      if (currency_id !== expectedCurrency) {
         await db.insert(schema.integrationEvents).values({
            provider: 'MERCADOPAGO',
            eventType: 'PAYMENT_CURRENCY_MISMATCH',
            payload: { paymentId, currency_id, expectedCurrency },
            simulated: false
         });
         return NextResponse.json({ success: false, error: 'Currency mismatch' }, { status: 400 });
      }

      // Buscar order
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(external_reference)) {
         return NextResponse.json({ success: false, error: 'Unknown orderId' }, { status: 404 });
      }

      const order = await db.query.tokenOrders.findFirst({
         where: eq(schema.tokenOrders.id, external_reference)
      });

      if (!order) {
         return NextResponse.json({ success: false, error: 'Unknown orderId' }, { status: 404 });
      }

      if (order.status !== 'pending') {
         return NextResponse.json({ success: false, error: 'Order not pending' }, { status: 400 });
      }

      const orderAmount = Number(order.totalAmount);
      if (Math.abs(orderAmount - transaction_amount) > 0.01) {
         return NextResponse.json({ success: false, error: 'Amount mismatch' }, { status: 400 });
      }

      // Verify User KYC
      const user = await db.query.investors.findFirst({
         where: eq(schema.investors.id, order.investorId)
      });

      if (!user || user.kycStatus === 'pending') {
         return NextResponse.json({ success: false, error: 'User KYC pending or missing' }, { status: 403 });
      }

      const quantityStr = order.quantity;

      // ATOMIC TRANSACTION
      await db.transaction(async (tx) => {
        await tx.update(schema.tokenOrders)
          .set({ status: 'completed' })
          .where(eq(schema.tokenOrders.id, order.id));
        
        await tx.insert(schema.genesisPurchases).values({
           id: crypto.randomUUID(),
           investorId: user.id,
           tokenAmount: quantityStr,
           totalUsdAmount: order.totalAmount,
           paymentReference: paymentId.toString()
        });

        await tx.insert(schema.tokenLedger).values({
           id: crypto.randomUUID(),
           investorId: user.id,
           amount: quantityStr,
           operation: 'mint',
           previousHash: 'pending',
           currentHash: `sim_${paymentId.toString()}`,
           txHash: paymentId.toString()
        });

        const currentBalance = await tx.query.balances.findFirst({
           where: eq(schema.balances.investorId, user.id)
        });

        if (currentBalance) {
           await tx.update(schema.balances)
             .set({ availableTokens: (Number(currentBalance.availableTokens) + Number(quantityStr)).toString(), lastUpdatedAt: new Date() })
             .where(eq(schema.balances.investorId, user.id));
        } else {
           await tx.insert(schema.balances).values({
             investorId: user.id,
             availableTokens: quantityStr
           });
        }

        await tx.insert(schema.auditLogs).values({
          action: 'MERCADOPAGO_WEBHOOK',
          details: `Payment processed: ID ${paymentId}`,
        });

        await tx.insert(schema.integrationEvents).values({
          provider: 'MERCADOPAGO',
          eventType: 'PAYMENT_APPROVED',
          payload: { paymentId },
          simulated: false
        });
      });
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
