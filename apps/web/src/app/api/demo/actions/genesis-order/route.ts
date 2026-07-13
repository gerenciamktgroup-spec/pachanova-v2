import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/src/utils/demoValidation';
import { z } from 'zod';
import crypto from 'crypto';

const bodySchema = z.object({
  investorId: z.string(),
  propertyId: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });
    validateDemoDatabaseUrl(process.env.DATABASE_URL || '');

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { investorId, propertyId, quantity, unitPrice } = result.data;
    const totalAmount = quantity * unitPrice;

    // Query current balance via Drizzle
    const currentBalance = await db.query.balances.findFirst({
      where: eq(schema.balances.investorId, investorId)
    });

    if (!currentBalance || Number(currentBalance.availableUsd || 0) < totalAmount) {
      return NextResponse.json({ error: 'Fondos insuficientes' }, { status: 400 });
    }

    // a) INSERT en token_orders via Drizzle
    const [newOrderData] = await db.insert(schema.tokenOrders).values({
      investorId,
      propertyId,
      quantity: quantity.toString(),
      unitPrice: unitPrice.toString(),
      totalAmount: totalAmount.toString(),
      currency: 'USD',
      status: 'completed',
      isDemo: true,
      metadata: { source: 'genesis_wizard' },
    }).returning();

    // b) UPDATE balances via Drizzle
    const newTokens = (Number(currentBalance.availableTokens || 0) + quantity).toString();
    const newUsd = (Number(currentBalance.availableUsd || 0) - totalAmount).toString();
    
    await db.update(schema.balances).set({
      availableTokens: newTokens,
      availableUsd: newUsd,
    }).where(eq(schema.balances.investorId, investorId));

    // c) INSERT en token_ledger via Drizzle
    const randomHash = crypto.randomUUID().replace(/-/g, '');
    await db.insert(schema.tokenLedger).values({
      investorId,
      operation: 'GENESIS_PURCHASE',
      amount: quantity.toString(),
      txHash: 'DEMO_' + crypto.randomUUID().slice(0, 8).toUpperCase(),
      previousHash: 'DEMO_PREV_' + randomHash,
      currentHash: 'DEMO_CURR_' + crypto.randomUUID().replace(/-/g, ''),
    });

    // d) INSERT en audit_logs via Drizzle
    await db.insert(schema.auditLogs).values({
      action: 'GENESIS_ORDER_COMPLETED',
      details: `Investor ${investorId} purchased ${quantity} PACHA tokens at $${unitPrice}`,
    });

    return NextResponse.json({ success: true, orderId: newOrderData?.id, newBalance: newTokens });
  } catch (error) {
    console.error("Genesis order error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
