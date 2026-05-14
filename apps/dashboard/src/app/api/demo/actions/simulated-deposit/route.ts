import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/src/utils/demoValidation';
import { z } from 'zod';

const bodySchema = z.object({
  investorId: z.string().uuid(),
  amountUsd: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });
    validateDemoDatabaseUrl(process.env.DATABASE_URL || '');

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { investorId, amountUsd } = result.data;

    await db.transaction(async (tx) => {
      // Upsert balance if it doesn't exist
      const existing = await tx.query.balances.findFirst({ where: eq(schema.balances.investorId, investorId) });
      if (!existing) {
        await tx.insert(schema.balances).values({
          investorId,
          availableUsd: amountUsd.toString(),
        });
      } else {
        await tx.update(schema.balances)
          .set({ availableUsd: sql`${schema.balances.availableUsd} + ${amountUsd}` })
          .where(eq(schema.balances.investorId, investorId));
      }

      await tx.insert(schema.auditLogs).values({
        action: 'DEMO_SIMULATED_DEPOSIT',
        details: `Simulated deposit of ${amountUsd} USD for investor ${investorId}`,
      });

      await tx.insert(schema.integrationEvents).values({
        provider: 'DEMO_SYSTEM',
        eventType: 'SIMULATED_DEPOSIT',
        payload: { investorId, amountUsd },
        simulated: true,
      });
    });

    return NextResponse.json({ success: true, message: `Deposited ${amountUsd} USD` });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
