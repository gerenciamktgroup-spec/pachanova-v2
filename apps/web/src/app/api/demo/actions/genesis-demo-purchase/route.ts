import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/utils/demoValidation';
import { z } from 'zod';

const bodySchema = z.object({
  investorId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });
    validateDemoDatabaseUrl(process.env.DATABASE_URL || '');

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { investorId, quantity } = result.data;

    // Execute everything in a single transaction
    await db.transaction(async (tx) => {
      // 1. Check KYC
      const user = await tx.query.investors.findFirst({ where: eq(schema.investors.id, investorId) });
      if (!user || user.kycStatus !== 'approved') {
        throw new Error('User KYC must be approved');
      }

      // 2. Check Balance
      const unitPrice = 8.40;
      const totalAmount = quantity * unitPrice;

      const balance = await tx.query.balances.findFirst({ where: eq(schema.balances.investorId, investorId) });
      if (!balance || parseFloat(balance.availableUsd) < totalAmount) {
        throw new Error(`Insufficient USD balance. Required: ${totalAmount}, Available: ${balance?.availableUsd || 0}`);
      }

      const orderId = crypto.randomUUID();

      const property = await tx.query.properties.findFirst();
      if (!property) throw new Error("No property found");

      // 3. Deduct USD, add PACHA
      await tx.update(schema.balances)
        .set({
          availableUsd: sql`${schema.balances.availableUsd} - ${totalAmount}`,
          availableTokens: sql`${schema.balances.availableTokens} + ${quantity}`,
        })
        .where(eq(schema.balances.investorId, investorId));

      await tx.insert(schema.tokenOrders).values({
        id: orderId,
        investorId: investorId,
        propertyId: property.id,
        quantity: quantity.toString(),
        unitPrice: unitPrice.toString(),
        totalAmount: totalAmount.toString(),
        status: 'demo_completed',
      });

      // 5. Create Genesis Purchase (demo mode)
      await tx.insert(schema.genesisPurchases).values({
        investorId,
        tokenAmount: quantity.toString(),
        usdPricePerToken: unitPrice.toString(),
        totalUsdAmount: totalAmount.toString(),
        status: 'completed',
        paymentReference: `demo-order-${orderId}`,
      });

      // 6. Token Ledger
      await tx.insert(schema.tokenLedger).values({
        investorId,
        amount: quantity.toString(),
        operation: 'mint',
        txHash: `demo-${orderId}`,
        previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: crypto.randomUUID(),
      });

      // 7. Audit & Integration Events
      await tx.insert(schema.auditLogs).values({
        action: 'GENESIS_DEMO_PURCHASE',
        details: `Investor ${investorId} purchased ${quantity} PACHA simulated`,
      });

      await tx.insert(schema.integrationEvents).values({
        provider: 'DEMO_SYSTEM',
        eventType: 'GENESIS_PURCHASE_SIMULATED',
        payload: { orderId, investorId, quantity, totalAmount },
        simulated: true,
      });
    });

    return NextResponse.json({ success: true, message: `Acquired ${quantity} PACHA in Genesis Demo` });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
