import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/src/utils/demoValidation';

const bodySchema = z.object({
  orderId: z.string().uuid(),
  buyerInvestorId: z.string().uuid(),
  quantity: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });
    validateDemoDatabaseUrl(process.env.DATABASE_URL || '');

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { orderId, buyerInvestorId, quantity } = result.data;

    // Transaction
    const responseData = await db.transaction(async (tx) => {
      // 1. Fetch order
      const order = await tx.query.p2pOrders.findFirst({
        where: eq(schema.p2pOrders.id, orderId)
      });

      if (!order || order.status !== 'open') {
        throw new Error('Orden no disponible');
      }

      const orderQuantity = Number(order.quantity);
      if (quantity > orderQuantity) {
        throw new Error('Cantidad solicitada excede la orden');
      }

      if (buyerInvestorId === order.sellerInvestorId) {
        throw new Error('No puedes comprar tu propia orden');
      }

      const pricePerToken = Number(order.pricePerToken);
      const totalAmount = quantity * pricePerToken;

      // 2. Validate buyer balance
      const buyerBalance = await tx.query.balances.findFirst({
        where: eq(schema.balances.investorId, buyerInvestorId)
      });

      if (!buyerBalance || Number(buyerBalance.availableUsd || 0) < totalAmount) {
        throw new Error('Fondos insuficientes USD');
      }

      // 3. Validate seller balance
      const sellerBalance = await tx.query.balances.findFirst({
        where: eq(schema.balances.investorId, order.sellerInvestorId)
      });

      if (!sellerBalance) {
        throw new Error('Vendedor sin balance configurado');
      }

      // 4. Create trade
      const [newTrade] = await tx.insert(schema.p2pTrades).values({
        orderId,
        propertyId: order.propertyId,
        buyerInvestorId,
        sellerInvestorId: order.sellerInvestorId,
        quantity: quantity.toString(),
        pricePerToken: order.pricePerToken,
        totalAmount: totalAmount.toString(),
        feeAmount: '0',
        isDemo: true
      }).returning();

      // 5. Update buyer balances
      const newBuyerTokens = (Number(buyerBalance.availableTokens || 0) + quantity).toString();
      const newBuyerUsd = (Number(buyerBalance.availableUsd || 0) - totalAmount).toString();

      await tx.update(schema.balances)
        .set({
          availableTokens: newBuyerTokens,
          availableUsd: newBuyerUsd,
          lastUpdatedAt: new Date()
        })
        .where(eq(schema.balances.investorId, buyerInvestorId));

      // 6. Update seller balances
      const newSellerUsd = (Number(sellerBalance.availableUsd || 0) + totalAmount).toString();
      const newSellerLockedTokens = (Number(sellerBalance.lockedTokens || 0) - quantity).toString();

      await tx.update(schema.balances)
        .set({
          availableUsd: newSellerUsd,
          lockedTokens: newSellerLockedTokens,
          lastUpdatedAt: new Date()
        })
        .where(eq(schema.balances.investorId, order.sellerInvestorId));

      // 7. Update order quantity and status
      const remainingQuantity = orderQuantity - quantity;
      const newStatus = remainingQuantity <= 0 ? 'filled' : 'open';

      await tx.update(schema.p2pOrders)
        .set({
          quantity: remainingQuantity.toString(),
          status: newStatus,
          updatedAt: new Date()
        })
        .where(eq(schema.p2pOrders.id, orderId));

      // 8. Insert audit logs
      await tx.insert(schema.auditLogs).values({
        action: 'P2P_TRADE_EXECUTED',
        details: `Trade executed: ${quantity} tokens for order ${orderId}`,
      });

      return {
        tradeId: newTrade?.id,
        newBalance: newBuyerTokens
      };
    });

    return NextResponse.json({ success: true, ...responseData });
  } catch (error) {
    console.error("P2P buy error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
