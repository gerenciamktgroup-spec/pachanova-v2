import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { emitNotification } from '@/lib/notifications/emitNotification';

const bodySchema = z.object({
  investorId: z.string(),
  status: z.enum(['approved', 'pending', 'rejected']),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { investorId, status } = result.data;

    try {
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

      await emitNotification({
        investorId,
        type: 'kyc',
        title: 'Verificación de Identidad (KYC)',
        message: `Tu estado de KYC ha sido actualizado a: ${status.toUpperCase()}`,
        isDemo: true
      });
    } catch (dbErr) {
      console.warn("DB KYC update fallback to simulation:", dbErr);
    }

    return NextResponse.json({ success: true, investorId, status });
  } catch (error) {
    return NextResponse.json({ success: true, message: "KYC actualizado simuladamente" });
  }
}
