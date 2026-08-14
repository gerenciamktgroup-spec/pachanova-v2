export const dynamic = 'force-dynamic';

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
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { desc } from "drizzle-orm";
import { requireRole } from "@/utils/auth/requireRole";
import { AdminControlPanel } from "@/components/product/AdminControlPanel";

type TreasuryData = {
  balanceUsd?: number | string;
  tokensSold?: number | string;
  totalSupply?: number | string;
  totalUsdRaised?: number | string;
  p2pVolume?: number | string;
  utilizationPercent?: number;
};

type SupabaseInvestor = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  role?: string | null;
  kyc_status?: string | null;
  is_verified?: boolean | null;
  balances?: Array<{
    available_tokens?: string | number;
    locked_tokens?: string | number;
    available_usd?: string | number;
    locked_usd?: string | number;
    last_updated_at?: string;
  }>;
  kyc_documents?: Array<{ status?: string }>;
};

type SupabaseAudit = { id: string; action: string; details: string; timestamp: string; user_id?: string | null };
type SupabaseEvent = { id: string; provider: string; event_type: string; timestamp: string; status?: string | null };
type SupabaseTokenOrder = { quantity: string | number; total_amount: string | number };

function normalizeKycStatus(value: unknown): UserAdminView["kycStatus"] {
  return value === "approved" || value === "rejected" ? value : "pending";
}

function normalizeAdminRole(value: unknown): UserAdminView["role"] {
  const role = typeof value === "string" ? value.toUpperCase() : "INVESTOR";
  return role === "ADMIN" || role === "OPERATOR" || role === "FIDUCIARIO" || role === "COMITE" ? role : "INVESTOR";
}

function normalizeEventStatus(value: unknown): IntegrationEventView["status"] {
  return value === "error" || value === "pending" ? value : "success";
}

// Fetch treasury via local API
async function fetchTreasury() {
  try {
    const dashUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';
    const res = await fetch(`${dashUrl}/api/treasury`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Treasury API returned ${res.status}`);
    const data = await res.json() as { treasury?: TreasuryData };
    return data.treasury ?? null;
  } catch (err) {
    console.error("Error fetching treasury:", err);
    return null;
  }
}

function getFallbackData(): { view: AdminDashboardView, users: UserAdminView[] } {
  const fallbackUsers: UserAdminView[] = [
    {
      id: "demo-investor-0000-0000-0000-000000000001",
      fullName: "Juan Pérez (Inversionista Demo)",
      email: "juan.perez@pachanova.local",
      kycStatus: "approved",
      isVerified: true,
      role: "INVESTOR",
      status: "ACTIVE",
      balance: {
        investorId: "demo-investor-0000-0000-0000-000000000001",
        availableTokens: "1250",
        lockedTokens: "0",
        availableUsd: "5000",
        lockedUsd: "0",
        lastUpdated: new Date().toISOString(),
      }
    },
    {
      id: "demo-investor-0000-0000-0000-000000000002",
      fullName: "María Rodríguez (Nueva Cuenta)",
      email: "maria.rodriguez@pachanova.local",
      kycStatus: "pending",
      isVerified: false,
      role: "INVESTOR",
      status: "ACTIVE",
      balance: {
        investorId: "demo-investor-0000-0000-0000-000000000002",
        availableTokens: "0",
        lockedTokens: "0",
        availableUsd: "0",
        lockedUsd: "0",
        lastUpdated: new Date().toISOString(),
      }
    }
  ];

  const view: AdminDashboardView = {
    overview: {
      totalUsers: 2,
      activeUsers: 2,
      totalTokensDistributed: "1250",
      systemHealth: "GO",
    },
    treasury: {
      totalUsdRaised: "$5,000",
      totalTokensIssued: "1250",
      totalTokensAvailable: "498750",
      fideicomisoStatus: "PENDING",
    },
    recentAuditLogs: [
      {
        id: "log-1",
        action: "KYC_APPROVED",
        details: "Identidad verificada (KYC Aprobado) para Juan Pérez",
        timestamp: new Date().toISOString(),
        actor: "Sistema",
      }
    ],
    recentIntegrationEvents: [
      {
        id: "event-1",
        provider: "MERCADOPAGO",
        event: "pago.acreditado",
        timestamp: new Date().toISOString(),
        status: "success",
      }
    ],
  };

  return { view, users: fallbackUsers };
}

async function TreasuryOverview() {
  const treasury = await fetchTreasury();
  if (!treasury) return (
    <div className="bg-pn-surface-strong border border-pn-border rounded-lg p-4 mb-8 text-pn-text-soft text-sm">
      ⚠️ Datos del Fondo Temporalmente no disponibles — mostrando valores de respaldo fuera de línea.
    </div>
  );

  return (
    <div className="bg-pn-surface-strong border border-pn-border rounded-lg p-6 mb-8">
      <h2 className="text-lg font-medium text-pn-text mb-4">📊 Resumen del Fondo Común (Tesorería)</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-pn-bg rounded-md border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase">💰 Fondos en Fideicomiso Legal</p>
          <p className="text-xl font-semibold text-pn-gold mt-1">${Number(treasury.balanceUsd || 0).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-pn-bg rounded-md border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase">🪙 Fracciones Adquiridas (Tokens)</p>
          <p className="text-xl font-semibold text-pn-text mt-1">{Number(treasury.tokensSold || 0).toLocaleString()} / {Number(treasury.totalSupply || 500000).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-pn-bg rounded-md border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase">📈 Capital Total Invertido</p>
          <p className="text-xl font-semibold text-pn-text mt-1">${Number(treasury.totalUsdRaised || 0).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-pn-bg rounded-md border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase">🔄 Intercambio entre Usuarios (P2P)</p>
          <p className="text-xl font-semibold text-pn-text mt-1">${Number(treasury.p2pVolume || 0).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-pn-bg rounded-md border border-pn-border">
          <p className="text-xs text-pn-text-soft uppercase">📊 Uso de Fondos en Obras</p>
          <p className="text-xl font-semibold text-pn-text mt-1">{Number(treasury.utilizationPercent || 0).toFixed(2)}%</p>
          <div className="w-full bg-pn-surface h-2 mt-2 rounded overflow-hidden">
            <div className="bg-pn-gold h-full" style={{ width: `${Math.min(100, treasury.utilizationPercent || 0)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Demo (Drizzle) data fetch ───────────────────────────────────────────────
async function fetchAdminDataDemo(): Promise<{ view: AdminDashboardView, users: UserAdminView[] }> {
  try {
    const investors = await db.query.investors.findMany({ limit: 50 });
    const balances = await db.query.balances.findMany();
    const balanceMap = new Map(balances.map(b => [b.investorId, b]));
    const totalTokens = balances.reduce((sum, b) => sum + Number(b.availableTokens || 0), 0);

    const auditLogs = await db.query.auditLogs.findMany({
      orderBy: [desc(schema.auditLogs.timestamp)],
      limit: 20,
    });

    const integrationEvents = await db.query.integrationEvents.findMany({
      orderBy: [desc(schema.integrationEvents.timestamp)],
      limit: 10,
    });

    const users: UserAdminView[] = investors.map(inv => {
      const balance = balanceMap.get(inv.id);
      return {
        id: inv.id,
        fullName: `${inv.firstName || ''} ${inv.lastName || ''}`.trim() || 'Usuario',
        email: inv.email,
        kycStatus: inv.kycStatus || 'pending',
        isVerified: inv.isVerified || false,
        role: normalizeAdminRole(inv.role),
        status: "ACTIVE",
        balance: {
          investorId: inv.id,
          availableTokens: balance?.availableTokens?.toString() || "0",
          lockedTokens: balance?.lockedTokens?.toString() || "0",
          availableUsd: balance?.availableUsd?.toString() || "0",
          lockedUsd: "0",
          lastUpdated: balance?.lastUpdatedAt?.toISOString() || new Date().toISOString(),
        }
      };
    });

    const recentAuditLogs = auditLogs.map((log) => ({
      id: log.id,
      action: log.action ?? "UNKNOWN",
      details: typeof log.details === "string" ? log.details : JSON.stringify(log.details ?? {}),
      timestamp: log.timestamp?.toISOString?.() ?? new Date().toISOString(),
      actor: log.userId ? `User:${log.userId}` : "System",
    }));

    const recentIntegrationEvents: IntegrationEventView[] = integrationEvents.map((ev) => ({
      id: ev.id,
      provider: ev.provider,
      event: ev.eventType,
      timestamp: ev.timestamp?.toISOString?.() ?? new Date().toISOString(),
      status: normalizeEventStatus(ev.status),
    }));

    const view: AdminDashboardView = {
      overview: {
        totalUsers: investors.length,
        activeUsers: investors.length,
        totalTokensDistributed: totalTokens.toString(),
        systemHealth: "GO",
      },
      treasury: {
        totalUsdRaised: "$0",
        totalTokensIssued: totalTokens.toString(),
        totalTokensAvailable: (500000 - totalTokens).toString(),
        fideicomisoStatus: "PENDING",
      },
      recentAuditLogs,
      recentIntegrationEvents,
    };

    return { view, users };
  } catch (err) {
    console.warn("Base de datos fuera de línea. Cargando datos simulados de respaldo:", err);
    return getFallbackData();
  }
}

// ─── Production (Supabase) data fetch ────────────────────────────────────────
async function fetchAdminDataProd(): Promise<{ view: AdminDashboardView, users: UserAdminView[] } | null> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { redirect("/login"); }
    const role = user.app_metadata?.role as string | undefined;
    if (role !== "admin" && role !== "operator") { redirect("/unauthorized"); }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { count: totalInvestors } = await supabaseAdmin
      .from("investors")
      .select("*", { count: "exact", head: true });

    const { data: allBalances } = await supabaseAdmin
      .from("balances")
      .select("available_tokens");
    const totalTokens = allBalances?.reduce((sum, b) => sum + Number(b.available_tokens || 0), 0) || 0;

    const { data: rawInvestors } = await supabaseAdmin
      .from("investors")
      .select(`id, first_name, last_name, email, role, kyc_status, is_verified, created_at,
        balances (*), kyc_documents!kyc_documents_investor_id_fkey (status)`)
      .order("created_at", { ascending: false })
      .limit(50);

    const users: UserAdminView[] = ((rawInvestors || []) as SupabaseInvestor[]).map((inv) => {
      const balance = (inv.balances && inv.balances.length > 0) ? inv.balances[0] : null;
      const kycDocs = inv.kyc_documents || [];
      const computedKycStatus = kycDocs.length > 0 ? kycDocs[0].status : (inv.kyc_status || "pending");
      return {
        id: inv.id,
        fullName: `${inv.first_name || ''} ${inv.last_name || ''}`.trim() || "Usuario",
        email: inv.email,
        kycStatus: normalizeKycStatus(computedKycStatus),
        isVerified: inv.is_verified || false,
        role: normalizeAdminRole(inv.role),
        status: "ACTIVE",
        balance: {
          investorId: inv.id,
          availableTokens: balance?.available_tokens?.toString() || "0",
          lockedTokens: balance?.locked_tokens?.toString() || "0",
          availableUsd: balance?.available_usd?.toString() || "0",
          lockedUsd: balance?.locked_usd?.toString() || "0",
          lastUpdated: balance?.last_updated_at || new Date().toISOString(),
        }
      };
    });

    const { data: rawAuditLogs } = await supabaseAdmin
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(20);

    const recentAuditLogs = ((rawAuditLogs || []) as SupabaseAudit[]).map((log) => ({
      id: log.id,
      action: log.action,
      details: log.details,
      timestamp: log.timestamp,
      actor: log.user_id ? `User:${log.user_id}` : "System",
    }));

    const { data: rawEvents } = await supabaseAdmin
      .from("integration_events")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(10);

    const recentIntegrationEvents: IntegrationEventView[] = ((rawEvents || []) as SupabaseEvent[]).map((ev) => ({
      id: ev.id,
      provider: ev.provider,
      event: ev.event_type,
      timestamp: ev.timestamp,
      status: normalizeEventStatus(ev.status),
    }));

    const { data: tokenOrders } = await supabaseAdmin
      .from("token_orders")
      .select("quantity, total_amount")
      .eq("status", "filled");

    const typedOrders = (tokenOrders || []) as SupabaseTokenOrder[];
    const tokensSold = typedOrders.reduce((acc, order) => acc + Number(order.quantity), 0);
    const usdRaised = typedOrders.reduce((acc, order) => acc + Number(order.total_amount), 0);

    const view: AdminDashboardView = {
      overview: {
        totalUsers: totalInvestors || 0,
        activeUsers: totalInvestors || 0,
        totalTokensDistributed: totalTokens.toString(),
        systemHealth: "GO",
      },
      treasury: {
        totalUsdRaised: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(usdRaised),
        totalTokensIssued: tokensSold.toString(),
        totalTokensAvailable: (500000 - tokensSold).toString(),
        fideicomisoStatus: "PENDING",
      },
      recentAuditLogs,
      recentIntegrationEvents,
    };

    return { view, users };
  } catch (error) {
    console.error("Error fetching admin view model, returning fallback:", error);
    return getFallbackData();
  }
}

async function AdminDashboardContent() {
  await requireRole(["admin", "operator"]);

  let data: { view: AdminDashboardView, users: UserAdminView[] } | null = null;
  if (process.env.DEMO_MODE === 'true') {
    data = await fetchAdminDataDemo();
  } else {
    data = await fetchAdminDataProd();
  }

  if (!data) {
    return <ErrorState title="Error de Admin" message="No se pudo construir el ViewModel de administrador." />;
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
          <SafeActionButton label="Landbank" href="/dashboard/admin/landbank" variant="primary" />
        </div>
      </div>

      <JourneyProgressRail journey={adminJourney} currentStepId="a1" />

      <NextStepCard
        dataTestId="next-step-card-admin"
        contextLabel="Consola Admin"
        title="Consola de Administración Centralizada"
        explanation="Bienvenido al centro administrativo de la plataforma. Desde esta sección puedes verificar identidades de inversionistas (KYC), auditar las transacciones y simular la aprobación de las firmas legales de la garantía del Fideicomiso."
        nextStep="Usa el Panel de Control Maestro abajo para simular aprobaciones, crear transacciones de prueba o revisar el historial de operaciones."
        primaryAction={{ label: "Gestión de Identidades (KYC)", href: "/dashboard/admin/users", intent: "navigate" }}
        secondaryAction={{ label: "Ver Historial de Auditoría", href: "/dashboard/admin/audit", intent: "navigate" }}
        status="GO"
      />

      {/* ─── Master Admin Control Panel ─── */}
      <AdminControlPanel users={data.users} />

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
    <Suspense fallback={<LoadingState message="Cargando consola de administrador..." />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
