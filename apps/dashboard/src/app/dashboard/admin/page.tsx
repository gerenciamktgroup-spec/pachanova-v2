import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { 
  AdminMissionOverview, 
  TreasuryMetricsPanel, 
  AdminUsersDataGrid, 
  AuditLogTimeline, 
  IntegrationEventsPanel 
} from "@/components/product";
import { AdminDashboardView, UserAdminView, IntegrationEventView } from "@/types/product";
import { Suspense } from "react";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { adminJourney } from "@/lib/navigation/userJourneys";

import { createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

async function fetchTreasury() {
  try {
    const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';
    const res = await fetch(`${webUrl}/api/treasury`, { cache: 'no-store' });
    const data = await res.json();
    return data.treasury;
  } catch (err) {
    console.error("Error fetching treasury:", err);
    return null;
  }
}

async function TreasuryOverview() {
  const treasury = await fetchTreasury();
  if (!treasury) return null;

  return (
    <div className="bg-pn-surface-strong border border-pn-border rounded-lg p-6 mb-8">
      <h2 className="text-lg font-medium text-pn-text mb-4">Treasury Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-pn-bg rounded-md border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase">💰 Balance Fideicomiso</p>
          <p className="text-xl font-semibold text-pn-gold mt-1">${Number(treasury.balanceUsd).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-pn-bg rounded-md border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase">🪙 Tokens Vendidos</p>
          <p className="text-xl font-semibold text-pn-text mt-1">{Number(treasury.tokensSold).toLocaleString()} / {Number(treasury.totalSupply).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-pn-bg rounded-md border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase">📈 USD Recaudado</p>
          <p className="text-xl font-semibold text-pn-text mt-1">${Number(treasury.totalUsdRaised).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-pn-bg rounded-md border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase">🔄 Volumen P2P</p>
          <p className="text-xl font-semibold text-pn-text mt-1">${Number(treasury.p2pVolume).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-pn-bg rounded-md border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase">📊 Utilización</p>
          <p className="text-xl font-semibold text-pn-text mt-1">{Number(treasury.utilizationPercent).toFixed(2)}%</p>
          <div className="w-full bg-pn-surface h-2 mt-2 rounded overflow-hidden">
            <div className="bg-pn-gold h-full" style={{ width: `${Math.min(100, treasury.utilizationPercent)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function fetchAdminData(): Promise<{ view: AdminDashboardView, users: UserAdminView[] } | null> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const role = user.app_metadata?.role as string | undefined;
    if (role !== "admin" && role !== "operator") {
      redirect("/unauthorized");
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Treasury Metrics
    const { count: totalInvestors } = await supabaseAdmin
      .from("investors")
      .select("*", { count: "exact", head: true });

    const { data: allBalances } = await supabaseAdmin
      .from("balances")
      .select("available_tokens");
    
    const totalTokens = allBalances?.reduce((sum, b) => sum + Number(b.available_tokens || 0), 0) || 0;

    const { count: pendingKyc } = await supabaseAdmin
      .from("kyc_documents")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // 2. Users Table
    const { data: rawInvestors } = await supabaseAdmin
      .from("investors")
      .select(`
        id, first_name, last_name, email, role, kyc_status, is_verified, created_at,
        balances (*),
        kyc_documents!kyc_documents_investor_id_fkey (status)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    const users: UserAdminView[] = (rawInvestors || []).map((inv: any) => {
      // Find latest balance or default
      const balance = (inv.balances && inv.balances.length > 0) ? inv.balances[0] : null;
      // Get KYC status from docs or fallback to investor level
      const kycDocs = inv.kyc_documents || [];
      const computedKycStatus = kycDocs.length > 0 ? kycDocs[0].status : (inv.kyc_status || "pending");

      return {
        id: inv.id,
        fullName: `${inv.first_name || ''} ${inv.last_name || ''}`.trim() || "Usuario",
        email: inv.email,
        kycStatus: computedKycStatus as any,
        isVerified: inv.is_verified || false,
        role: (inv.role || "INVESTOR").toUpperCase() as any,
        status: "ACTIVE", // Demo mapping
        balance: {
          investorId: inv.id,
          availableTokens: balance?.available_tokens?.toString() || "0",
          lockedTokens: balance?.locked_tokens?.toString() || "0",
          availableUsd: balance?.available_usd?.toString() || "0",
          lockedUsd: balance?.locked_usd?.toString() || "0",
          lastUpdated: balance?.last_updated_at || new Date().toISOString()
        }
      };
    });

    // 3. Audit logs
    const { data: rawAuditLogs } = await supabaseAdmin
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(20);

    const recentAuditLogs = (rawAuditLogs || []).map((log: any) => ({
      id: log.id,
      action: log.action,
      details: log.details,
      timestamp: log.timestamp,
      actor: log.user_id ? `User:${log.user_id}` : "System"
    }));

    // 4. Integration events
    const { data: rawEvents } = await supabaseAdmin
      .from("integration_events")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(10);

    const recentIntegrationEvents = (rawEvents || []).map((ev: any) => ({
      id: ev.id,
      provider: ev.provider as any,
      event: ev.event_type,
      timestamp: ev.timestamp,
      status: ev.status as IntegrationEventView['status']
    }));

    // OPCIÓN B — Query directo a token_orders para treasury metrics
    const { data: tokenOrders } = await supabaseAdmin
      .from("token_orders")
      .select("quantity, total_amount")
      .eq("status", "filled");

    const tokensSold = tokenOrders?.reduce(
      (acc: number, o: any) => acc + Number(o.quantity), 0
    ) ?? 0;

    const usdRaised = tokenOrders?.reduce(
      (acc: number, o: any) => acc + Number(o.total_amount), 0
    ) ?? 0;

    const treasurySummary = {
      totalUsdRaised: new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD"
      }).format(usdRaised),
      totalTokensIssued: tokensSold.toString(),
      totalTokensAvailable: (500000 - tokensSold).toString(),
      fideicomisoStatus: "PENDING" as "PENDING"
    };

    const view: AdminDashboardView = {
      overview: {
        totalUsers: totalInvestors || 0,
        activeUsers: totalInvestors || 0,
        totalTokensDistributed: totalTokens.toString(),
        systemHealth: "GO"
      },
      treasury: treasurySummary,
      recentAuditLogs,
      recentIntegrationEvents
    };

    return { view, users };
  } catch (error) {
    console.error("Error fetching admin view model:", error);
    return null;
  }
}

async function AdminDashboardContent() {
  const data = await fetchAdminData();

  if (!data) {
    return <ErrorState title="Error de Simulación" message="No se pudo construir el ViewModel de administrador." />;
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Consola Admin" }
        ]} />
        <div className="flex flex-wrap gap-2">
          <SafeActionButton label="Usuarios y KYC" href="/dashboard/admin/users" variant="ghost" />
          <SafeActionButton label="Órdenes Token" href="/dashboard/admin/token-orders" variant="ghost" />
          <SafeActionButton label="Auditoría" href="/dashboard/admin/audit" variant="ghost" />
          <SafeActionButton label="Integraciones" href="/dashboard/admin/integrations" variant="ghost" />
        </div>
      </div>

      <JourneyProgressRail journey={adminJourney} currentStepId="a1" />

      <NextStepCard 
        dataTestId="next-step-card-admin"
        contextLabel="Consola Admin"
        title="Control Operativo Simulado"
        explanation="Estás en la consola de control operativo demo. Aquí puedes auditar los logs locales, gestionar los usuarios simulados y revisar los tokens generados."
        nextStep="Revisa el módulo 'Usuarios y KYC' para interactuar con la revisión de inversores."
        primaryAction={{ label: "Ir a Usuarios y KYC", href: "/dashboard/admin/users", intent: "navigate" }}
        secondaryAction={{ label: "Ver Auditoría", href: "/dashboard/admin/audit", intent: "navigate" }}
        status="GO"
      />
      <AdminMissionOverview view={data.view} />

      <TreasuryOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TreasuryMetricsPanel view={data.view} />
          <AdminUsersDataGrid users={data.users} />
        </div>
        
        <div className="space-y-8">
          <AuditLogTimeline view={data.view} />
          <IntegrationEventsPanel view={data.view} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando panel de control de administrador..." />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
