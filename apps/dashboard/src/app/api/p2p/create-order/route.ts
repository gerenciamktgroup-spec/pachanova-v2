import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

const bodySchema = z.object({
  sellerInvestorId: z.string().uuid(),
  quantity: z.number().positive(),
  pricePerToken: z.number().positive(),
  propertyId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { sellerInvestorId, quantity, pricePerToken, propertyId } = result.data;
    const totalAmount = quantity * pricePerToken;

    await db.transaction(async (tx) => {
      const user = await tx.query.users.findFirst({ where: eq(schema.users.id, sellerInvestorId) });
      if (!user || user.kycStatus !== 'approved') {
        throw new Error('User KYC must be approved to sell tokens');
      }

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

      let property;
      if (propertyId) {
        property = await tx.query.properties.findFirst({ where: eq(schema.properties.id, propertyId) });
      }
      if (!property) property = await tx.query.properties.findFirst({ where: eq(schema.properties.name, 'Paracas Land Reserve — PNC-PAR-001') });
      if (!property) property = await tx.query.properties.findFirst();
      if (!property) throw new Error("No property found (landbank 5PNC)");

      const orderId = crypto.randomUUID();
      await tx.insert(schema.p2pOrders).values({
        id: orderId,
        sellerInvestorId,
        propertyId: property.id,
        quantity: quantity.toString(),
        pricePerToken: pricePerToken.toString(),
        totalAmount: totalAmount.toString(),
        status: 'open',
        isDemo: false,
      });

      await tx.insert(schema.auditLogs).values({
        action: 'P2P_ORDER_CREATED',
        details: `Investor ${sellerInvestorId} created order to sell ${quantity} PACHA at ${pricePerToken}`,
      });
    });

    return NextResponse.json({ success: true, message: `Created P2P order for ${quantity} PACHA` });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
