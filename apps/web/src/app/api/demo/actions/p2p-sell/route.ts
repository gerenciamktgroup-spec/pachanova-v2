import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/src/utils/demoValidation';

const bodySchema = z.object({
  sellerInvestorId: z.string().uuid(),
  propertyId: z.string().uuid(),
  quantity: z.number().positive(),
  pricePerToken: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });
    validateDemoDatabaseUrl(process.env.DATABASE_URL || '');

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { sellerInvestorId, propertyId, quantity, pricePerToken } = result.data;
    const totalAmount = quantity * pricePerToken;

    const responseData = await db.transaction(async (tx) => {
      // 1. Validate seller balance
      const sellerBalance = await tx.query.balances.findFirst({
        where: eq(schema.balances.investorId, sellerInvestorId)
      });

      if (!sellerBalance || Number(sellerBalance.availableTokens || 0) < quantity) {
        throw new Error('Tokens PACHA insuficientes para vender');
      }

      // 2. Insert P2P Order
      const [newOrder] = await tx.insert(schema.p2pOrders).values({
        sellerInvestorId,
        propertyId,
        quantity: quantity.toString(),
        pricePerToken: pricePerToken.toString(),
        totalAmount: totalAmount.toString(),
        status: 'open',
        isDemo: true
      }).returning();

      // 3. Update seller balances: availableTokens -= quantity, lockedTokens += quantity
      const newAvailable = (Number(sellerBalance.availableTokens || 0) - quantity).toString();
      const newLocked = (Number(sellerBalance.lockedTokens || 0) + quantity).toString();

      await tx.update(schema.balances)
        .set({
          availableTokens: newAvailable,
          lockedTokens: newLocked,
          updatedAt: new Date()
        })
        .where(eq(schema.balances.investorId, sellerInvestorId));

      // 4. Insert audit logs
      await tx.insert(schema.auditLogs).values({
        action: 'P2P_ORDER_CREATED',
        details: `Investor ${sellerInvestorId} listed ${quantity} tokens for sale`,
      });

      return {
        orderId: newOrder?.id
      };
    });

    return NextResponse.json({ success: true, ...responseData });
  } catch (error) {
    console.error("P2P sell error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
