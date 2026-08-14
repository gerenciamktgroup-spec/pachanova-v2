import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { DEFAULT_DEMO_INVESTOR, schema } from '@pachanova/database';
import { createHash, randomUUID } from 'crypto';
import { and, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { emitNotification } from '@/lib/notifications/emitNotification';
import { assertDemoRequest } from '@/server/demoActions/demoRequestGuard';

const bodySchema = z.object({
  quantity: z.number().int().positive().max(50000),
});

export async function POST(req: Request) {
  try {
    assertDemoRequest(req);

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { quantity } = result.data;
    let investorId = '';
    let orderId = '';
    let updatedBalance: { availableUsd: string; availableTokens: string } | undefined;

    // Execute everything in a single transaction
    await db.transaction(async (tx) => {
      // 1. Check KYC
      const user = await tx.query.investors.findFirst({ where: eq(schema.investors.email, DEFAULT_DEMO_INVESTOR.email) });
      if (!user || user.kycStatus !== 'approved') {
        throw new Error('User KYC must be approved');
      }
      investorId = user.id;

      // 2. Check Balance
      const unitPrice = 8.40;
      const totalAmount = quantity * unitPrice;

      const balance = await tx.query.balances.findFirst({ where: eq(schema.balances.investorId, investorId) });
      if (!balance || parseFloat(balance.availableUsd) < totalAmount) {
        throw new Error(`Insufficient USD balance. Required: ${totalAmount}, Available: ${balance?.availableUsd || 0}`);
      }

      orderId = crypto.randomUUID();

      // 3. Deduct USD, add PACHA
      const [balanceAfterPurchase] = await tx.update(schema.balances)
        .set({
          availableUsd: sql`${schema.balances.availableUsd} - ${totalAmount}`,
          availableTokens: sql`${schema.balances.availableTokens} + ${quantity}`,
          lastUpdatedAt: new Date(),
        })
        .where(and(
          eq(schema.balances.investorId, investorId),
          sql`${schema.balances.availableUsd} >= ${totalAmount}`,
        ))
        .returning({ availableUsd: schema.balances.availableUsd, availableTokens: schema.balances.availableTokens });
      if (!balanceAfterPurchase) throw new Error('Insufficient USD balance for this purchase');
      updatedBalance = balanceAfterPurchase;

      const property = await tx.query.properties.findFirst();
      if (!property) throw new Error("No property found");

      // 4. Create Token Order (completed)
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
      const latestLedger = await tx.query.tokenLedger.findFirst({
        where: eq(schema.tokenLedger.investorId, investorId),
        orderBy: [desc(schema.tokenLedger.timestamp)],
      });
      const previousHash = latestLedger?.currentHash ?? '0x0000000000000000000000000000000000000000000000000000000000000000';
      const timestamp = new Date();
      const txHash = `0x${createHash('sha256').update(`genesis:${orderId}:${randomUUID()}`).digest('hex')}`;
      const currentHash = `0x${createHash('sha256').update(`${previousHash}:mint:${investorId}:${quantity}:${timestamp.toISOString()}`).digest('hex')}`;
      await tx.insert(schema.tokenLedger).values({
        investorId,
        amount: quantity.toString(),
        operation: 'mint',
        txHash,
        previousHash,
        currentHash,
        timestamp,
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

    // Emit notification (fire-and-forget, errors swallowed inside)
    await emitNotification({
      investorId,
      type: 'transaction',
      title: 'Compra Genesis Registrada',
      message: `Adquiriste ${quantity} PACHA en la ronda Genesis Demo`,
      actionUrl: '/dashboard/investor',
      isDemo: true,
    });

    return NextResponse.json({ success: true, orderId, balance: updatedBalance, message: `Adquiridos ${quantity} PACHA en Genesis Demo` });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
