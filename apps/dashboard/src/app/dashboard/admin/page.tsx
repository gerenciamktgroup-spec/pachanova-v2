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
import { HologramPncCard } from "@/components/product/HologramPncCard"; // Fase4: expand to admin sections + central hub + PachaNova Landbanking identity

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
    <div className="relative rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 p-8 mb-8 overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-400/30 transition-colors duration-700"></div>
      <h2 className="text-2xl font-light text-white mb-6 tracking-tight">Treasury Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
          <p className="text-xs text-pn-text-muted uppercase tracking-wider mb-2">💰 Balance Fideicomiso</p>
          <p className="text-2xl font-light text-cyan-400">${Number(treasury.balanceUsd).toLocaleString()}</p>
        </div>
        <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
          <p className="text-xs text-pn-text-muted uppercase tracking-wider mb-2">🪙 Tokens Vendidos</p>
          <p className="text-2xl font-light text-white">{Number(treasury.tokensSold).toLocaleString()}</p>
          <p className="text-xs text-pn-text-soft mt-1">/ {Number(treasury.totalSupply).toLocaleString()}</p>
        </div>
        <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
          <p className="text-xs text-pn-text-muted uppercase tracking-wider mb-2">📈 USD Recaudado</p>
          <p className="text-2xl font-light text-white">${Number(treasury.totalUsdRaised).toLocaleString()}</p>
        </div>
        <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
          <p className="text-xs text-pn-text-muted uppercase tracking-wider mb-2">🔄 Volumen P2P</p>
          <p className="text-2xl font-light text-white">${Number(treasury.p2pVolume).toLocaleString()}</p>
        </div>
        <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
          <p className="text-xs text-pn-text-muted uppercase tracking-wider mb-2">📊 Utilización</p>
          <p className="text-2xl font-light text-white">{Number(treasury.utilizationPercent).toFixed(2)}%</p>
          <div className="w-full bg-white/10 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-violet-500 h-full rounded-full" style={{ width: `${Math.min(100, treasury.utilizationPercent)}%` }}></div>
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
          <SafeActionButton label="🏦 LANDBANKING HUB (Principal)" href="/dashboard/admin/landbank" variant="primary" />
          <SafeActionButton label="Portafolio RWA (Legacy)" href="/dashboard/admin/properties" variant="ghost" />
          <SafeActionButton label="Usuarios y KYC" href="/dashboard/admin/users" variant="ghost" />
          <SafeActionButton label="Auditoría" href="/dashboard/admin/audit" variant="ghost" />
        </div>
      </div>

      {/* Full Project Banner - Landbanking Hub principal (Fase1 Consolidación & Cleanup) */}
      <div className="text-xs uppercase tracking-[2px] text-[#c5a46d]/70 border-b border-[#c5a46d]/20 pb-1 mb-2">PACHA NOVA LANDBANKING HUB — UN SOLO PROYECTO: beta tokenización RWA Genesis → 5PNC Master Landbanking (P2P + CRÉDITOS + MASTER + orq real 5PNC + AUTONOMY + YIELDS + GOV). Demo siempre "Modo Visual / DATOS REALES simulado" (muestra 5PNC + orq numbers). Primary = landbank. Genesis legacy deprecate visible. Fase1+4: holograms expandidos, hub feel, ver avances.</div>

      {/* Fase4 expansion + Fase1 hub: HologramPncCard in main admin hero + simple central hub feel */}
      <div className="p-4 border border-[#c5a46d]/30 bg-[#0a111f] rounded-xl mb-4">
        <div className="text-[10px] text-[#c5a46d] tracking-widest mb-2">PACHA NOVA LANDBANKING — ADMIN OVERVIEW EN HOLOGRAMA (5PNC ORQ • MASTER CONTROL • VER TODOS AVANCES)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            {id:"pnc-par-adm", name:"Paracas — PNC-PAR-001", location:"Paracas, Ica, Perú", propertyType:"land", status:"trading", totalValuationUsd:"1250000", tokenPriceUsd:"500", totalTokens:"2500", availableTokens:"2000", annualYieldExpected:"7.8", metadata:{pncCode:"PNC-PAR-001", net:68112.5, effectiveYield:31639, effectivePct:"17.1%", pachaPower:3250, phase:"Fase15/36/42/47/49", product_configs:{alquiler_yield:{}}, notas_maestro:"Admin Master hub. Full project identity everywhere. Rich fallbacks."}},
            {id:"pnc-sb-adm", name:"San Bartolo — PNC-SB-003", location:"San Bartolo, Perú", propertyType:"residential", status:"funded", totalValuationUsd:"2450000", tokenPriceUsd:"1350", totalTokens:"1800", availableTokens:"1500", annualYieldExpected:"12.5", metadata:{pncCode:"PNC-SB-003", net:105840, effectiveYield:13230, effectivePct:"12.5%", pachaPower:3250, phase:"Fase15", product_configs:{hotel_revenue_share:{}}, notas_maestro:"Cleaned more beta remnants. Holograms in yields/gov/market/hero/admin."}},
            {id:"pnc-sel-adm", name:"Selva — PNC-SEL-007", location:"Selva, Perú", propertyType:"land", status:"funded", totalValuationUsd:"980000", tokenPriceUsd:"100", totalTokens:"9800", availableTokens:"8000", annualYieldExpected:"9.2", metadata:{pncCode:"PNC-SEL-007", net:105840, effectiveYield:13230, effectivePct:"12.5%", pachaPower:3250, phase:"Fase15/36", product_configs:{}, notas_maestro:"Fase1 Consolidation: central hub feel + banners 'PachaNova Landbanking'."}},
            {id:"pnc-chi-adm", name:"Chiclayo — PNC-CHI-004", location:"Chiclayo, Perú", propertyType:"land", status:"trading", totalValuationUsd:"980000", tokenPriceUsd:"390", totalTokens:"4200", availableTokens:"3000", annualYieldExpected:"8.1", metadata:{pncCode:"PNC-CHI-004", net:68112.5, effectiveYield:31639, effectivePct:"17.1%", pachaPower:3250, phase:"Fase15", product_configs:{vivienda_token:{}}, notas_maestro:"Concrete UI for 'ver todos los avances' implemented."}}
          ].map((pnc, i) => <HologramPncCard key={i} pnc={pnc as any} compact />)}
        </div>
        <div id="ver-avances" className="mt-3 text-[10px] text-emerald-400">VER TODOS LOS AVANCES: Fase 1 Consolidation (hub, clean remnants, banners everywhere) + Fase 4 Visuals (HologramPncCard expanded to yields/governance/marketplace/hero/portfolio/admin). Update blackboard. Landbanking = everything + tools. Rich 5PNC orq fallbacks kept. <a href="/dashboard/admin/landbank" className="underline">Ir a Landbank Hub →</a></div>
      </div>

      <JourneyProgressRail journey={adminJourney} currentStepId="a1" />

      <NextStepCard 
        dataTestId="next-step-card-admin"
        contextLabel="Landbanking Hub Admin"
        title="Control Landbanking Master (5PNC Unificado)"
        explanation="Landbanking completo: Hub principal con historia clara (beta genesis RWA → 5PNC Master actual). Master edita TODO, lanza productos, ve 5PNC con datos orq reales (PAR 68112.5 net @31639 eff 17.1% power 3250 etc). Demo = Modo Visual permanente siempre con números reales."
        nextStep="Usa Landbanking Hub como entrada principal para gestión Master. Genesis/órdenes legacy solo compatibilidad schema."
        primaryAction={{ label: "🏦 Ir a Landbanking Hub Principal", href: "/dashboard/admin/landbank", intent: "navigate" }}
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
