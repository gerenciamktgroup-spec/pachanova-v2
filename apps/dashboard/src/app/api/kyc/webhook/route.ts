import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { getKycProvider } from '@/lib/kyc';
import { emitNotification } from '@/lib/notifications/emitNotification';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const signature = req.headers.get("X-App-Access-Sig") || "";
    const provider = getKycProvider();

    const webhookResult = await provider.handleWebhook(payload, signature);

    if (!webhookResult) {
      // Not handled or simulated
      return NextResponse.json({ success: true, message: 'Simulated or unhandled event ignored' });
    }

    const { investorId, result } = webhookResult;

    await db.transaction(async (tx) => {
      // 1. Update investor KYC status
      await tx.update(schema.investors)
        .set({
          kycStatus: result.status,
          isVerified: result.status === 'approved',
        })
        .where(eq(schema.investors.id, investorId));

      // 2. Insert audit log
      await tx.insert(schema.auditLogs).values({
        action: 'KYC_PROVIDER_WEBHOOK',
        details: `KYC callback for ${investorId}: Status ${result.status.toUpperCase()}`,
      });

      // 3. Insert integration event
      await tx.insert(schema.integrationEvents).values({
        provider: 'SUMSUB',
        eventType: 'KYC_WEBHOOK_RECEIVED',
        payload: { payload, status: result.status },
        simulated: false,
      });
    });

    // 4. Emit notification to user
    await emitNotification({
      investorId,
      type: 'kyc',
      title: 'Verificación de Identidad (KYC)',
      message: `Tu validación de KYC ha finalizado con estado: ${result.status.toUpperCase()}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("KYC Webhook error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
