import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { DEFAULT_DEMO_INVESTOR, schema } from '@pachanova/database';
import { createHash, randomUUID } from 'crypto';
import { and, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { assertDemoRequest } from '@/server/demoActions/demoRequestGuard';

const bodySchema = z.object({
  orderId: z.string().uuid(),
});

export async function POST(req: Request) {
  try {
    assertDemoRequest(req);

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { orderId } = result.data;
    let buyerInvestorId = '';

    await db.transaction(async (tx) => {
      // 1. Check KYC of buyer
      const user = await tx.query.investors.findFirst({ where: eq(schema.investors.email, DEFAULT_DEMO_INVESTOR.email) });
      if (!user || user.kycStatus !== 'approved') {
        throw new Error('Buyer KYC must be approved');
      }
      buyerInvestorId = user.id;

      // 2. Fetch Order
      const order = await tx.query.p2pOrders.findFirst({ where: eq(schema.p2pOrders.id, orderId) });
      if (!order) throw new Error('Order not found');
      if (order.status !== 'open') throw new Error('Order is not open');
      if (order.sellerInvestorId === buyerInvestorId) throw new Error('Cannot buy your own order');

      const [claimedOrder] = await tx.update(schema.p2pOrders)
        .set({ status: 'filled', updatedAt: new Date() })
        .where(and(eq(schema.p2pOrders.id, orderId), eq(schema.p2pOrders.status, 'open')))
        .returning({ id: schema.p2pOrders.id });
      if (!claimedOrder) throw new Error('Order was already processed');

      const totalAmount = parseFloat(order.totalAmount);
      const quantity = parseFloat(order.quantity);

      // 3. Check Buyer Balance
      const buyerBalance = await tx.query.balances.findFirst({ where: eq(schema.balances.investorId, buyerInvestorId) });
      if (!buyerBalance || parseFloat(buyerBalance.availableUsd) < totalAmount) {
        throw new Error('Insufficient USD balance to buy this order');
      }

      // 4. Execute Trade (Balances)
      // Decrease buyer USD, Increase buyer Tokens
      const [debitedBuyer] = await tx.update(schema.balances)
        .set({
          availableUsd: sql`${schema.balances.availableUsd} - ${totalAmount}`,
          availableTokens: sql`${schema.balances.availableTokens} + ${quantity}`,
          lastUpdatedAt: new Date(),
        })
        .where(and(
          eq(schema.balances.investorId, buyerInvestorId),
          sql`${schema.balances.availableUsd} >= ${totalAmount}`,
        ))
        .returning({ investorId: schema.balances.investorId });
      if (!debitedBuyer) throw new Error('Insufficient USD balance to buy this order');

      // Increase seller USD, Decrease seller reservedTokens
      const [creditedSeller] = await tx.update(schema.balances)
        .set({
          availableUsd: sql`${schema.balances.availableUsd} + ${totalAmount}`,
          reservedTokens: sql`${schema.balances.reservedTokens} - ${quantity}`,
          lastUpdatedAt: new Date(),
        })
        .where(and(
          eq(schema.balances.investorId, order.sellerInvestorId),
          sql`${schema.balances.reservedTokens} >= ${quantity}`,
        ))
        .returning({ investorId: schema.balances.investorId });
      if (!creditedSeller) throw new Error('Seller reserved balance is inconsistent');

      // 5. Update Order and Create Trade
      const tradeId = crypto.randomUUID();
      await tx.insert(schema.p2pTrades).values({
        id: tradeId,
        orderId: order.id,
        propertyId: order.propertyId,
        buyerInvestorId,
        sellerInvestorId: order.sellerInvestorId,
        quantity: order.quantity,
        pricePerToken: order.pricePerToken,
        totalAmount: order.totalAmount,
        isDemo: true,
      });

      // 6. Token Ledgers
      const [sellerLedger, buyerLedger] = await Promise.all([
        tx.query.tokenLedger.findFirst({ where: eq(schema.tokenLedger.investorId, order.sellerInvestorId), orderBy: [desc(schema.tokenLedger.timestamp)] }),
        tx.query.tokenLedger.findFirst({ where: eq(schema.tokenLedger.investorId, buyerInvestorId), orderBy: [desc(schema.tokenLedger.timestamp)] }),
      ]);
      const timestamp = new Date();
      const sellerPreviousHash = sellerLedger?.currentHash ?? '0x0000000000000000000000000000000000000000000000000000000000000000';
      const buyerPreviousHash = buyerLedger?.currentHash ?? '0x0000000000000000000000000000000000000000000000000000000000000000';
      const sellerTxHash = `0x${createHash('sha256').update(`p2p:sell:${tradeId}:${randomUUID()}`).digest('hex')}`;
      const buyerTxHash = `0x${createHash('sha256').update(`p2p:buy:${tradeId}:${randomUUID()}`).digest('hex')}`;
      await tx.insert(schema.tokenLedger).values([
        {
          investorId: order.sellerInvestorId,
          amount: (-quantity).toString(),
          operation: 'transfer',
          txHash: sellerTxHash,
          previousHash: sellerPreviousHash,
          currentHash: `0x${createHash('sha256').update(`${sellerPreviousHash}:transfer:${order.sellerInvestorId}:${-quantity}:${timestamp.toISOString()}`).digest('hex')}`,
          timestamp,
        },
        {
          investorId: buyerInvestorId,
          amount: quantity.toString(),
          operation: 'transfer',
          txHash: buyerTxHash,
          previousHash: buyerPreviousHash,
          currentHash: `0x${createHash('sha256').update(`${buyerPreviousHash}:transfer:${buyerInvestorId}:${quantity}:${timestamp.toISOString()}`).digest('hex')}`,
          timestamp,
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
