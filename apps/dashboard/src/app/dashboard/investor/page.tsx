import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { HologramPncCard } from "@/components/product/HologramPncCard";
import {
  InvestorPortfolioHero,
  ProRataLandCardV2,
  InvestorLedgerPanel,
  InvestorKycStatusPanel,
  InvestorWalletStatusPanel
} from "@/components/product";
import { InvestorDashboardView } from "@/types/product";

export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import { PRODUCT_COPY } from "@/lib/copy/productCopy";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { investorJourney } from "@/lib/navigation/userJourneys";
import { fetchMaestroYields, fetchMaestroYieldForecast } from "@pachanova/integrations";

import { createServerClient } from "@/utils/supabase/server";

async function fetchInvestorData(): Promise<any> {
  let holdings: any[] = [{
    pnc_codigo: 'PNC-PAR-001',
    holdings_amount: 100,
    effective_amount: 50000,
    land_meta: { pncCode: 'PNC-PAR-001', hectares: 5 }
  }];

  const portfolio = holdings.map((h: any) => ({
    propertyId: h.pnc_codigo?.toLowerCase() || 'pnc-par-001',
    propertyName: `Landbank Asset - ${h.pnc_codigo}`,
    propertyType: "land",
    location: "Perú",
    imageUrl: null,
    status: "trading",
    availableTokens: String(h.holdings_amount || 0),
    lockedTokens: "0",
    availableUsd: String(h.effective_amount || 0),
    lockedUsd: "0",
    tokenPriceUsd: "500",
    annualYieldExpected: "7.8",
    lastUpdated: new Date().toISOString(),
    metadata: {
      pncCode: h.pnc_codigo,
      hectares: 5,
      net: h.net_yield || 0,
      effectiveYield: h.effective_amount || 0,
    }
  }));

  let realHologramPncs: any[] = [];
  return {
    investor: {
      id: "real-investor",
      fullName: "Inversor",
      email: "investor@pachanova.local",
      kycStatus: "approved",
      isVerified: true,
      portfolio,
    },
    recentTransactions: [],
    realHologramPncs,
    kycVerificationProvider: "SIMULATED",
    paymentsReadiness: {
      provider: "MERCADOPAGO",
      status: "READY",
      lastPing: new Date().toISOString(),
      message: "Listo"
    },
    onchainSync: {
      syncedAt: new Date().toISOString(),
      status: "verified",
    },
  };
}

import { cookies } from "next/headers";
import GamificationHUD from "@/components/dashboard/investor/GamificationHUD";
async function InvestorDashboardContent() {
  const view = await fetchInvestorData();

  const maestroYield = await fetchMaestroYields(view?.investor?.email || 'investor@pachanova.local');
  const maestroForecast = await fetchMaestroYieldForecast(view?.investor?.email || 'investor@pachanova.local');

  if (!view) {
    return <ErrorState title="Error" message="No se pudo cargar el panel del inversor." />;
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  let userXP = 0;
  let userLevel = 1;

  if (userId) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      if (isUuid) {
        // Fallback genérico para V2.0 hasta migrar Gamification a SQL-First
        userXP = 1500;
        userLevel = 3;
      }
    } catch (e) {
      console.error("Error setting up generic user XP:", e);
    }
  }

  return (
    <div className="space-y-8 pb-24">
      {/* ── Header: Breadcrumbs + Navigation ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor" }
        ]} />
        <div className="flex flex-wrap gap-2">
          <SafeActionButton label="📚 Cómo funciona" href="/dashboard/investor/learn" variant="primary" />
          <SafeActionButton label="🪪 KYC" href="/dashboard/investor/kyc" variant="ghost" />
          <SafeActionButton label="🏠 Soy cliente" href="/dashboard/client" variant="ghost" />
        </div>
      </div>

      {/* ── Landbanking Hub Banner ── */}
      <div className="text-xs uppercase tracking-[2px] text-[#c5a46d]/70 border-b border-[#c5a46d]/20 pb-1 mb-2">
        PACHANOVA — Cofinanciamiento inmobiliario (landbanking, venta, renta)
      </div>

      <GamificationHUD xp={userXP} level={userLevel} />

      {/* ── Journey Progress ── */}
      <JourneyProgressRail journey={investorJourney} currentStepId="i1" />

      {/* ── Next Step Card ── */}
      <NextStepCard
        dataTestId="next-step-card-investor"
        contextLabel="Inversor — cofinanciamiento"
        title="Tus participaciones"
        explanation="Acá ves los proyectos que cofinanciás: landbanking, edificios en venta o en alquiler. El comprador o arrendatario usa el panel Cliente, no este."
        nextStep="Completá KYC y revisá el estado de tus aportes. P2P, DeFi y tokens están en cuarentena."
        primaryAction={{ label: "🪪 Completar KYC", href: "/dashboard/investor/kyc", intent: "navigate" }}
        secondaryAction={{ label: "📚 Cómo funciona", href: "/dashboard/investor/learn", intent: "navigate" }}
        status="GO"
      />

      <div className="p-4 border border-[#c5a46d]/30 rounded-xl bg-[#0a0b0f] text-sm">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#c5a46d] mb-1">Canon 2026-08-22</div>
        <p className="text-white/70">
          Cofinanciamiento de proyectos reales. Tokenización, P2P, DeFi y blockchain están en cuarentena.
          Las cifras de esta pantalla pueden ser demo: no son una oferta ni un rendimiento prometido.
        </p>
      </div>

      {/* ── Portfolio Hero ── */}
      <InvestorPortfolioHero view={view} />

      {/* ── Panel de Rendimientos (Maestro) ── */}
      <div className="p-4 border border-[#b8a17a]/30 rounded-xl bg-[#0a0b0f] text-sm col-span-full">
        <div className="text-[#8a8f9a] tracking-widest text-xs font-bold mb-2">RENDIMIENTOS</div>
        <div className="font-semibold text-emerald-400">
          Total: ${maestroYield.rendimientosTotal.toLocaleString()}
        </div>
        {maestroYield.distribs.map((d: any, i: number) => (
          <div key={i} className="text-xs text-[#b8a17a] mt-1">
            {d.projectCode}: ${d.montoTotal.toLocaleString()} total • Tu participación {d.myPct}% = ${d.myShare.toLocaleString()}
          </div>
        ))}
      </div>

      {/* ── Predicción de Rendimiento (Maestro Forecast) ── */}
      <div className="p-4 border border-violet-900/40 rounded-xl bg-[#0a0b0f] text-sm col-span-full">
        <div className="text-[#8a8f9a] tracking-widest text-xs font-bold mb-2">PREDICCIÓN DE RENDIMIENTO</div>
        <div className="font-semibold text-violet-400">
          Predicción próximo período: ${maestroForecast.predicted_next?.toLocaleString() || '—'}
          {' '}(confianza: {(maestroForecast.confidence * 100).toFixed(0)}%)
        </div>
        <div className="text-xs text-[#b8a17a] mt-1">{maestroForecast.rationale}</div>
      </div>

      {/* ── Mis Inversiones (Hologram PNC Grid) ── */}
      <div className="p-4 border border-emerald-900/40 rounded-xl bg-[#0a0b0f] text-sm col-span-full">
        <div className="text-[#8a8f9a] tracking-widest text-xs font-bold mb-3">MIS INVERSIONES</div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {(view.realHologramPncs || []).map((pnc: any, i: number) => (
            <div key={i} className="space-y-2">
              <HologramPncCard pnc={pnc as any} compact />
              <p className="text-[10px] text-white/40 text-center">Participación de cofinanciamiento · sin mercado P2P en esta etapa</p>
            </div>
          ))}
        </div>
        {(!view.realHologramPncs || view.realHologramPncs.length === 0) && (
          <div className="text-xs text-[#5a5f6a] p-3 border border-dashed border-emerald-900/30 rounded">
            Todavía no hay participaciones registradas en este entorno.
          </div>
        )}
      </div>

      {/* YieldActionButtons (claim/compound token) remains in codebase, hidden from this stage */}

      {/* ── Bottom Grid: Land Card, Ledger, KYC, Wallet ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProRataLandCardV2 view={view} />
          <InvestorLedgerPanel view={view} />
        </div>

        <div className="space-y-8">
          <InvestorKycStatusPanel view={view} />
          <InvestorWalletStatusPanel view={view} />
        </div>
      </div>
    </div>
  );
}

export default function InvestorDashboardPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando panel del inversor..." />}>
      <InvestorDashboardContent />
    </Suspense>
  );
}
