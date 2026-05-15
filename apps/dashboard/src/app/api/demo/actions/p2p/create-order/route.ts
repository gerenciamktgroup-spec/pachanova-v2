import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/src/utils/demoValidation';
import { z } from 'zod';

const bodySchema = z.object({
  sellerInvestorId: z.string().uuid(),
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

    const { sellerInvestorId, quantity, pricePerToken } = result.data;
    const totalAmount = quantity * pricePerToken;

    await db.transaction(async (tx) => {
      // 1. Check KYC
      const user = await tx.query.investors.findFirst({ where: eq(schema.investors.id, sellerInvestorId) });
      if (!user || user.kycStatus !== 'approved') {
        throw new Error('User KYC must be approved to sell tokens');
      }

      // 2. Check and Reserve Tokens
      const balance = await tx.query.balances.findFirst({ where: eq(schema.balances.investorId, sellerInvestorId) });
      if (!balance || parseFloat(balance.availableTokens) < quantity) {
        throw new Error('Insufficient available PACHA tokens to sell');
      }

      await tx.update(schema.balances)
        .set({
          availableTokens: sql`${schema.balances.availableTokens} - ${quantity}`,
          reservedTokens: sql`${schema.balances.reservedTokens} + ${quantity}`
        })
        .where(eq(schema.balances.investorId, sellerInvestorId));

      const property = await tx.query.properties.findFirst();
      if (!property) throw new Error("No property found");

      // 3. Create Order
      const orderId = crypto.randomUUID();
      await tx.insert(schema.p2pOrders).values({
        id: orderId,
        sellerInvestorId,
        propertyId: property.id,
        quantity: quantity.toString(),
        pricePerToken: pricePerToken.toString(),
        totalAmount: totalAmount.toString(),
        status: 'open',
        isDemo: true,
      });

      // 4. Audit
      await tx.insert(schema.auditLogs).values({
        action: 'P2P_ORDER_CREATED',
        details: `Investor ${sellerInvestorId} created order to sell ${quantity} PACHA at ${pricePerToken}`,
      });

      await tx.insert(schema.integrationEvents).values({
        provider: 'DEMO_SYSTEM',
        eventType: 'P2P_ORDER_CREATED',
        payload: { orderId, sellerInvestorId, quantity, pricePerToken },
        simulated: true,
      });
    });

    return NextResponse.json({ success: true, message: `Created P2P order for ${quantity} PACHA` });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
