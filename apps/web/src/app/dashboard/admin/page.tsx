export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs } from "@/components/mission/RouteBreadcrumbs";
import { LoadingState, ErrorState } from "@/components/mission/StateComponents";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { Suspense } from "react";
import { createClient } from '@supabase/supabase-js';
import { AdminOverviewClient } from "@/components/product/AdminMasterPanel";

const TREASURY_ID = 'PACHANOVA_TREASURY';

async function fetchAdminOverviewData() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        totalUsers: 0,
        kycPending: 0,
        kycApproved: 0,
        totalUsdRaised: '0',
        treasuryAvailable: '500000',
        treasurySold: '0',
        recentAuditLogs: [],
        users: [],
      };
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const [investorsRes, treasuryRes, auditRes, balancesRes] = await Promise.all([
      supabase.from('investors').select('id, first_name, last_name, email, kyc_status, is_verified, created_at'),
      supabase.from('balances').select('available_tokens, available_usd').eq('investor_id', TREASURY_ID).maybeSingle(),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('balances').select('investor_id, available_usd, available_tokens').neq('investor_id', TREASURY_ID),
    ]);

    const investors = investorsRes.data || [];
    const treasury = treasuryRes.data;
    const auditLogs = auditRes.data || [];
    const allBalances = balancesRes.data || [];

    const balanceMap = Object.fromEntries(allBalances.map(b => [b.investor_id, b]));

    const users = investors.map(inv => ({
      id: inv.id,
      fullName: `${inv.first_name} ${inv.last_name}`,
      email: inv.email,
      kycStatus: inv.kyc_status as 'pending' | 'approved' | 'rejected',
      isVerified: inv.is_verified,
      createdAt: inv.created_at,
      availableUsd: balanceMap[inv.id]?.available_usd || '0',
      availableTokens: balanceMap[inv.id]?.available_tokens || '0',
    }));

    const totalUsdRaised = allBalances.reduce((acc, b) => acc + Number(b.available_usd || 0), 0);
    const treasurySold = 500000 - Number(treasury?.available_tokens || 500000);

    return {
      totalUsers: investors.length,
      kycPending: investors.filter(i => i.kyc_status === 'pending').length,
      kycApproved: investors.filter(i => i.kyc_status === 'approved').length,
      totalUsdRaised: totalUsdRaised.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      treasuryAvailable: (Number(treasury?.available_tokens || 500000)).toLocaleString(),
      treasurySold: treasurySold.toLocaleString(),
      recentAuditLogs: auditLogs,
      users,
    };
  } catch (error) {
    console.error('fetchAdminOverviewData error:', error);
    return null;
  }
}

async function AdminContent() {
  const data = await fetchAdminOverviewData();
  if (!data) return <ErrorState title="Error" message="No se pudo cargar el panel de control" />;
  return <AdminOverviewClient data={data} />;
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <RouteBreadcrumbs items={[{ label: "Dashboard" }, { label: "Panel Maestro" }]} />
        <div className="flex flex-wrap gap-2">
          <SafeActionButton label="KYC Review" href="/dashboard/admin/kyc-review" variant="primary" />
          <SafeActionButton label="Saldos" href="/dashboard/admin/balances" variant="ghost" />
          <SafeActionButton label="Tesorería" href="/dashboard/admin/treasury" variant="ghost" />
          <SafeActionButton label="Avisos" href="/dashboard/admin/announcements" variant="ghost" />
          <SafeActionButton label="Auditoría" href="/dashboard/admin/audit" variant="ghost" />
        </div>
      </div>
      <Suspense fallback={<LoadingState message="Cargando panel maestro..." />}>
        <AdminContent />
      </Suspense>
    </div>
  );
}
