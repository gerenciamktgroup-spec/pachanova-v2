import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/src/utils/demoValidation';
import { z } from 'zod';

const bodySchema = z.object({
  buyerInvestorId: z.string().uuid(),
  orderId: z.string().uuid(),
});

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });
    validateDemoDatabaseUrl(process.env.DATABASE_URL || '');

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { buyerInvestorId, orderId } = result.data;

    await db.transaction(async (tx) => {
      // 1. Check KYC of buyer
      const user = await tx.query.investors.findFirst({ where: eq(schema.investors.id, buyerInvestorId) });
      if (!user || user.kycStatus !== 'approved') {
        throw new Error('Buyer KYC must be approved');
      }

      // 2. Fetch Order
      const order = await tx.query.p2pOrders.findFirst({ where: eq(schema.p2pOrders.id, orderId) });
      if (!order) throw new Error('Order not found');
      if (order.status !== 'open') throw new Error('Order is not open');
      if (order.sellerInvestorId === buyerInvestorId) throw new Error('Cannot buy your own order');

      const totalAmount = parseFloat(order.totalAmount);
      const quantity = parseFloat(order.quantity);

      // 3. Check Buyer Balance
      const buyerBalance = await tx.query.balances.findFirst({ where: eq(schema.balances.investorId, buyerInvestorId) });
      if (!buyerBalance || parseFloat(buyerBalance.availableUsd) < totalAmount) {
        throw new Error('Insufficient USD balance to buy this order');
      }

      // 4. Execute Trade (Balances)
      // Decrease buyer USD, Increase buyer Tokens
      await tx.update(schema.balances)
        .set({
          availableUsd: sql`${schema.balances.availableUsd} - ${totalAmount}`,
          availableTokens: sql`${schema.balances.availableTokens} + ${quantity}`,
        })
        .where(eq(schema.balances.investorId, buyerInvestorId));

      // Increase seller USD, Decrease seller reservedTokens
      await tx.update(schema.balances)
        .set({
          availableUsd: sql`${schema.balances.availableUsd} + ${totalAmount}`,
          reservedTokens: sql`${schema.balances.reservedTokens} - ${quantity}`,
        })
        .where(eq(schema.balances.investorId, order.sellerInvestorId));

      // 5. Update Order and Create Trade
      await tx.update(schema.p2pOrders)
        .set({ status: 'completed' })
        .where(eq(schema.p2pOrders.id, orderId));

      const tradeId = crypto.randomUUID();
      await tx.insert(schema.p2pTrades).values({
        id: tradeId,
        orderId: order.id,
        buyerInvestorId,
        sellerInvestorId: order.sellerInvestorId,
        quantity: order.quantity,
        pricePerToken: order.pricePerToken,
        totalAmount: order.totalAmount,
        simulated: true,
      });

      // 6. Token Ledgers
      await tx.insert(schema.tokenLedger).values([
        {
          investorId: order.sellerInvestorId,
          amount: (-quantity).toString(),
          operation: 'transfer',
          txHash: `demo-sell-${tradeId}`,
          previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          currentHash: crypto.randomUUID(),
        },
        {
          investorId: buyerInvestorId,
          amount: quantity.toString(),
          operation: 'transfer',
          txHash: `demo-buy-${tradeId}`,
          previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          currentHash: crypto.randomUUID(),
        }
      ]);

      // 7. Audit
      await tx.insert(schema.auditLogs).values({
        action: 'P2P_ORDER_EXECUTED',
        details: `Buyer ${buyerInvestorId} bought ${quantity} PACHA from ${order.sellerInvestorId} for ${totalAmount} USD`,
      });
      await tx.insert(schema.integrationEvents).values({
        provider: 'DEMO_SYSTEM',
        eventType: 'P2P_TRADE_SIMULATED',
        payload: { tradeId, orderId, buyerInvestorId, sellerInvestorId: order.sellerInvestorId },
        simulated: true,
      });
    });

    return NextResponse.json({ success: true, message: `Successfully purchased P2P order` });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
