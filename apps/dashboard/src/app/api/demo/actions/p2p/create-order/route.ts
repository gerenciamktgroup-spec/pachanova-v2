import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { DEFAULT_DEMO_INVESTOR, schema } from '@pachanova/database';
import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { assertDemoRequest } from '@/server/demoActions/demoRequestGuard';

const bodySchema = z.object({
  quantity: z.number().positive().max(500000),
  pricePerToken: z.number().positive().max(1000000),
  pncCode: z.enum(['PAR', 'VIV', 'YLD', 'HTL', 'MIX']).optional(),
});

export async function POST(req: Request) {
  try {
    assertDemoRequest(req);

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { quantity, pricePerToken, pncCode } = result.data;
    const totalAmount = quantity * pricePerToken;
    let sellerInvestorId = '';

    await db.transaction(async (tx) => {
      // 1. Check KYC
      const user = await tx.query.investors.findFirst({ where: eq(schema.investors.email, DEFAULT_DEMO_INVESTOR.email) });
      if (!user || user.kycStatus !== 'approved') {
        throw new Error('User KYC must be approved to sell tokens');
      }
      sellerInvestorId = user.id;

      // 2. Check and Reserve Tokens
      const balance = await tx.query.balances.findFirst({ where: eq(schema.balances.investorId, sellerInvestorId) });
      if (!balance || parseFloat(balance.availableTokens) < quantity) {
        throw new Error('Insufficient available PACHA tokens to sell');
      }

      const [reservedBalance] = await tx.update(schema.balances)
        .set({
          availableTokens: sql`${schema.balances.availableTokens} - ${quantity}`,
          reservedTokens: sql`${schema.balances.reservedTokens} + ${quantity}`,
          lastUpdatedAt: new Date(),
        })
        .where(and(
          eq(schema.balances.investorId, sellerInvestorId),
          sql`${schema.balances.availableTokens} >= ${quantity}`,
        ))
        .returning({ investorId: schema.balances.investorId });
      if (!reservedBalance) throw new Error('Insufficient available PACHA tokens to sell');

      const properties = await tx.query.properties.findMany();
      const property = pncCode
        ? properties.find((candidate) => {
            const metadata = candidate.metadata;
            return metadata && typeof metadata === 'object' && 'code' in metadata && metadata.code === pncCode;
          })
        : properties[0];
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

      // 4. Audit (Fase 6 P2P landbank tie: include pncCode if provided for 5PNC E2E)
      const pncNote = pncCode ? ` for PNC ${pncCode}` : '';
      await tx.insert(schema.auditLogs).values({
        action: 'P2P_ORDER_CREATED',
        details: `Investor ${sellerInvestorId} created order to sell ${quantity} PACHA at ${pricePerToken}${pncNote}`,
      });

      await tx.insert(schema.integrationEvents).values({
        provider: 'DEMO_SYSTEM',
        eventType: 'P2P_ORDER_CREATED',
        payload: { orderId, sellerInvestorId, quantity, pricePerToken, pncCode: pncCode || null },
        simulated: true,
      });
    });

    return NextResponse.json({ success: true, message: `Created P2P order for ${quantity} PACHA` });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
