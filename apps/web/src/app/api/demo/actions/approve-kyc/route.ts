import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, and, desc } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/src/utils/demoValidation';

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });
    validateDemoDatabaseUrl(process.env.DATABASE_URL || '');

    const body = await req.json();
    const { investorId } = body;

    if (!investorId) {
      return NextResponse.json({ error: 'investorId required' }, { status: 400 });
    }

    // Get the most recent pending KYC document
    const kycDoc = await db.query.kycDocuments.findFirst({
      where: and(
        eq(schema.kycDocuments.investorId, investorId),
        eq(schema.kycDocuments.status, 'pending')
      ),
      orderBy: [desc(schema.kycDocuments.createdAt)]
    });

    if (!kycDoc) {
      // If no pending, we can still update the investor directly
      await db.update(schema.investors)
        .set({
          kycStatus: 'approved',
          isVerified: true
        })
        .where(eq(schema.investors.id, investorId));
    } else {
      // Update kyc_documents
      await db.update(schema.kycDocuments)
        .set({
          status: 'approved',
          updatedAt: new Date()
        })
        .where(eq(schema.kycDocuments.id, kycDoc.id));

      // Also update the investor's kyc_status
      await db.update(schema.investors)
        .set({
          kycStatus: 'approved',
          isVerified: true
        })
        .where(eq(schema.investors.id, investorId));
    }

    // Insert audit log
    await db.insert(schema.auditLogs).values({
      action: 'KYC_APPROVED_DEMO',
      details: `KYC for investor ${investorId} automatically approved in demo`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approve KYC error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
