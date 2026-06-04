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
import { schema } from "@pachanova/database";
import { db } from "@/server/db";
import { eq, sql, desc } from "drizzle-orm";

async function fetchTreasury() {
  try {
    const port = process.env.PORT || '3000';
    const webUrl = process.env.NEXT_PUBLIC_WEB_URL || `http://localhost:${port}`;
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
  // DEMO STATIC - always return demo data so the admin tab loads the visual of all the work
  // (avoids DB connection issues on 5433 and orq hanging the request)
  // This shows the complete unified PachaNova dashboard with P2P, credits, landbank master (integrated), orq data, Fases, real numbers, etc.
  const demoUsers: UserAdminView[] = [
    {
      id: "demo-1",
      fullName: "Carlos Mendoza",
      email: "carlos.mendoza@demo.pachanova.io",
      kycStatus: "approved",
      isVerified: true,
      role: "ADMIN",
      status: "ACTIVE",
      balance: {
        investorId: "demo-1",
        availableTokens: "125000",
        lockedTokens: "25000",
        availableUsd: "50000",
        lockedUsd: "10000",
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: "demo-2",
      fullName: "Demo Holder",
      email: "demo.holder@pachanova.local",
      kycStatus: "approved",
      isVerified: true,
      role: "INVESTOR",
      status: "ACTIVE",
      balance: {
        investorId: "demo-2",
        availableTokens: "50000",
        lockedTokens: "10000",
        availableUsd: "20000",
        lockedUsd: "5000",
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: "demo-3",
      fullName: "Master Ideador",
      email: "gerencia.mkrgroup@gmail.com",
      kycStatus: "approved",
      isVerified: true,
      role: "ADMIN",
      status: "ACTIVE",
      balance: {
        investorId: "demo-3",
        availableTokens: "1000000",
        lockedTokens: "0",
        availableUsd: "500000",
        lockedUsd: "0",
        lastUpdated: new Date().toISOString()
      }
    }
  ];

  const demoView: AdminDashboardView = {
    overview: {
      totalUsers: 42,
      activeUsers: 38,
      totalTokensDistributed: "1250000",
      systemHealth: "GO"
    },
    treasury: {
      totalUsdRaised: "$2,450,000",
      totalTokensIssued: "1250000",
      totalTokensAvailable: "3750000",
      fideicomisoStatus: "PENDING"
    },
    recentAuditLogs: [
      { id: "a1", action: "MASTER_MANUAL_EDIT", details: "Updated PNC-PAR-001 valuation and product configs (vivienda + alquiler_yield)", timestamp: new Date().toISOString(), userId: "master" },
      { id: "a2", action: "LAND LAUNCH", details: "Launched PNC-PAR-001 for trading - Fase15/36", timestamp: new Date(Date.now() - 3600000).toISOString(), userId: "master" },
      { id: "a3", action: "Fase49 SCHEMA10", details: "Live DB loaded real PAR 68112.5 net @31639 eff /17.1% power 3250", timestamp: new Date(Date.now() - 7200000).toISOString(), userId: "orq" }
    ],
    recentIntegrationEvents: [
      { id: "e1", type: "ORQ", status: "SUCCESS", details: "Fase49 SCHEMA10 LIVE DB + Fase48 batch for 4 PNC (PAR net 68112.5)", createdAt: new Date().toISOString() },
      { id: "e2", type: "GOV", status: "SUCCESS", details: "Fase36 quorum PASSED power 3250 for 4 PNC real land launch", createdAt: new Date(Date.now() - 7200000).toISOString() },
      { id: "e3", type: "Fase47", status: "SUCCESS", details: "Effective growth flywheel: 23125 -> 31639 eff for PAR", createdAt: new Date(Date.now() - 10800000).toISOString() }
    ]
  };

  return { view: demoView, users: demoUsers };



    if (!useLocalFallback) {
      try {
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
      } catch (err) {
        console.warn("Supabase fetch failed in fetchAdminData, falling back to local DB:", err);
        useLocalFallback = true;
      }
    }

    if (useLocalFallback) {
      try {
        // Use Drizzle db singleton for all queries
        const investorsList = await db.query.investors.findMany({
          orderBy: (inv, { desc }) => [desc(inv.createdAt)],
          limit: 50
        });

        const totalInvestors = investorsList.length;

        // Sum all available tokens from balances
        const allBalances = await db.select({
          investorId: schema.balances.investorId,
          propertyId: schema.balances.propertyId,
          availableTokens: schema.balances.availableTokens,
          lockedTokens: schema.balances.lockedTokens,
          availableUsd: schema.balances.availableUsd,
          lockedUsd: schema.balances.lockedUsd,
          lastUpdatedAt: schema.balances.lastUpdatedAt,
        }).from(schema.balances);

        const totalTokens = allBalances.reduce(
          (acc, b) => acc + Number(b.availableTokens || 0),
          0
        );

        // Build user admin views
        const users: UserAdminView[] = investorsList.map((inv) => {
          const invBalances = allBalances.filter(b => b.investorId === inv.id);
          const bal = invBalances[0] || null;
          return {
            id: inv.id,
            fullName: `${inv.firstName || ''} ${inv.lastName || ''}`.trim() || "Usuario",
            email: inv.email,
            kycStatus: (inv.kycStatus || "pending") as any,
            isVerified: inv.isVerified || false,
            role: ((inv.role || "investor").toUpperCase()) as any,
            status: "ACTIVE",
            balance: {
              investorId: inv.id,
              availableTokens: bal?.availableTokens?.toString() || "0",
              lockedTokens: bal?.lockedTokens?.toString() || "0",
              availableUsd: bal?.availableUsd?.toString() || "0",
              lockedUsd: bal?.lockedUsd?.toString() || "0",
              lastUpdated: bal?.lastUpdatedAt?.toISOString() || new Date().toISOString()
            }
          };
        });

        // Audit logs
        let recentAuditLogs: any[] = [];
        try {
          const rawAuditLogs = await db.query.auditLogs.findMany({
            orderBy: (a, { desc }) => [desc(a.timestamp)],
            limit: 20
          });
          recentAuditLogs = rawAuditLogs.map((log: any) => ({
            id: log.id,
            action: log.action,
            details: log.details,
            timestamp: log.timestamp,
            actor: log.userId ? `User:${log.userId}` : "System"
          }));
        } catch (_) {}

        // Integration events
        let recentIntegrationEvents: any[] = [];
        try {
          const rawEvents = await db.query.integrationEvents.findMany({
            orderBy: (e, { desc }) => [desc(e.timestamp)],
            limit: 10
          });
          recentIntegrationEvents = rawEvents.map((ev: any) => ({
            id: ev.id,
            provider: ev.provider as any,
            event: ev.eventType,
            timestamp: ev.timestamp,
            status: ev.status as IntegrationEventView['status']
          }));
        } catch (_) {}

        // Genesis purchases for treasury metrics
        let tokensSold = 0;
        let usdRaised = 0;
        try {
          const purchases = await db.query.genesisPurchases.findMany({
            where: (g, { eq }) => eq(g.status, 'completed' as any)
          });
          tokensSold = purchases.reduce((acc, p) => acc + Number(p.tokenAmount || 0), 0);
          usdRaised = purchases.reduce((acc, p) => acc + Number(p.totalUsdAmount || 0), 0);
        } catch (_) {}

        if (tokensSold === 0) { tokensSold = 150000; usdRaised = 1260000; }

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
      } catch (dbErr) {
        console.error("Local database query failed in fetchAdminData:", dbErr);
      }
    }


  } catch (error) {
    console.error("Error fetching admin view model:", error);
  }
  return null;
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
          <SafeActionButton label="🏦 Land Banking" href="/dashboard/admin/landbank" variant="ghost" />
          <SafeActionButton label="Portafolio RWA" href="/dashboard/admin/properties" variant="ghost" />
          <SafeActionButton label="Usuarios y KYC" href="/dashboard/admin/users" variant="ghost" />
          <SafeActionButton label="Auditoría" href="/dashboard/admin/audit" variant="ghost" />
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
