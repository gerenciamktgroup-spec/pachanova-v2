import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql, count } from 'drizzle-orm';

/**
 * Fase 140: Compliance KYC Status API
 * Provides a consolidated view of KYC status across all investors.
 * Useful for admin compliance dashboard and regulatory reporting.
 * 
 * GET - Returns aggregated KYC statistics
 * POST - Trigger KYC review for a specific investor
 */
export async function GET() {
  try {
    // Aggregate KYC stats
    const allInvestors = await db.query.investors.findMany({
      columns: {
        id: true,
        kycStatus: true,
        email: true,
        createdAt: true,
      },
      limit: 500,
    });

    const stats = {
      total: allInvestors.length,
      approved: allInvestors.filter(i => i.kycStatus === 'approved').length,
      pending: allInvestors.filter(i => i.kycStatus === 'pending').length,
      rejected: allInvestors.filter(i => i.kycStatus === 'rejected').length,
      notStarted: allInvestors.filter(i => !i.kycStatus || i.kycStatus === 'not_started').length,
    };

    const complianceRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

    // Recent KYC actions from audit logs
    const recentAudit = await db.query.auditLogs.findMany({
      where: sql`${schema.auditLogs.action} LIKE '%KYC%' OR ${schema.auditLogs.action} LIKE '%P2P%' OR ${schema.auditLogs.action} LIKE '%FIDEICOMISO%'`,
      orderBy: sql`${schema.auditLogs.createdAt} DESC`,
      limit: 10,
    });

    return NextResponse.json({
      success: true,
      stats,
      complianceRate: `${complianceRate}%`,
      recentActivity: recentAudit.map(a => ({
        action: a.action,
        details: a.details?.substring(0, 200),
        timestamp: a.createdAt,
      })),
      note: 'Fase140 Compliance KYC Dashboard • Real investor data from Supabase. P2P trades require KYC approved (Fase138). Fideicomiso operations audit-logged (Fase139).',
    });
  } catch (e: any) {
    // Thin fallback for when DB is not connected
    return NextResponse.json({
      success: true,
      stats: {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        notStarted: 0,
        note: 'DB not connected - thin fallback. Connect Supabase for live compliance data.',
      },
      complianceRate: 'N/A',
      recentActivity: [],
      note: `Fase140 Compliance API (thin fallback): ${e.message}`,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { investorId, action: kycAction } = body || {};
    
    if (!investorId) {
      return NextResponse.json({ error: 'investorId required' }, { status: 400 });
    }

    if (kycAction === 'approve') {
      await db.update(schema.investors)
        .set({ kycStatus: 'approved' })
        .where(eq(schema.investors.id, investorId));

      await db.insert(schema.auditLogs).values({
        action: 'KYC_APPROVED',
        details: `Investor ${investorId} KYC approved via Fase140 compliance API`,
      });

      return NextResponse.json({ success: true, message: `KYC approved for ${investorId}` });
    }

    if (kycAction === 'reject') {
      await db.update(schema.investors)
        .set({ kycStatus: 'rejected' })
        .where(eq(schema.investors.id, investorId));

      await db.insert(schema.auditLogs).values({
        action: 'KYC_REJECTED',
        details: `Investor ${investorId} KYC rejected via Fase140 compliance API`,
      });

      return NextResponse.json({ success: true, message: `KYC rejected for ${investorId}` });
    }

    return NextResponse.json({ error: 'Invalid action. Use "approve" or "reject"' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
