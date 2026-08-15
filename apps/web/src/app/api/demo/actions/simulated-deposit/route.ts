import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

const bodySchema = z.object({
  investorId: z.string(),
  amountUsd: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { investorId, amountUsd } = result.data;

    try {
      await db.transaction(async (tx) => {
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
    } catch (dbErr) {
      console.warn("DB simulated deposit fallback to simulation:", dbErr);
    }

    return NextResponse.json({ success: true, investorId, amountUsd });
  } catch (error) {
    return NextResponse.json({ success: true, message: "Depósito simulado acreditado" });
  }
}
