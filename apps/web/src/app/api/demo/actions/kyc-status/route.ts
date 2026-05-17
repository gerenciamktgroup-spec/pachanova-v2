import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/utils/demoValidation';
import { z } from 'zod';

const bodySchema = z.object({
  investorId: z.string().uuid(),
  status: z.enum(['approved', 'pending', 'rejected']),
});

export async function POST(req: Request) {
  try {
    const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (!isDemo) return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { investorId, status } = result.data;

    // Mock bypass: if DATABASE_URL is missing, return simulated success
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true, investorId, status, message: 'KYC status updated (mock)' });
    }

    validateDemoDatabaseUrl(process.env.DATABASE_URL || '');

    await db.transaction(async (tx) => {
      await tx.update(schema.investors)
        .set({ kycStatus: status })
        .where(eq(schema.investors.id, investorId));

      await tx.insert(schema.auditLogs).values({
        action: 'DEMO_KYC_STATUS_UPDATED',
        details: `Investor ${investorId} KYC status set to ${status}`,
      });

      await tx.insert(schema.integrationEvents).values({
        provider: 'DEMO_SYSTEM',
        eventType: 'KYC_SIMULATED_UPDATE',
        payload: { investorId, status },
        simulated: true,
      });
    });

    return NextResponse.json({ success: true, investorId, status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
