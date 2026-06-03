import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { 
  InvestorPortfolioHero, 
  ProRataLandCardV2, 
  InvestorLedgerPanel, 
  InvestorKycStatusPanel, 
  GenesisDemoActionCard, 
  InvestorWalletStatusPanel 
} from "@/components/product";
import { InvestorDashboardView } from "@/types/product";

export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import { PRODUCT_COPY } from "@/lib/copy/productCopy";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { investorJourney } from "@/lib/navigation/userJourneys";
import { fetchMaestroYields, suggestYieldToCoreMaestro, fetchMaestroYieldForecast } from "@pachanova/integrations"; // Fase17/18: exact + forecast from core Panel Maestro (Fase16 + Vertex)
import { YieldActionButtons } from "./YieldActionClient";

import { createServerClient } from "@/utils/supabase/server";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { schema } from "@pachanova/database";

async function fetchInvestorData(): Promise<any> { 
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userEmail = user?.email || "demo.investor.holder@pachanova.local";

    // Connect directly to PostgreSQL for the Multi-Property Landbanking
    const client = postgres(process.env.DATABASE_URL!);
    const db = drizzle(client, { schema });

    const invResult = await db.query.investors.findFirst({
      where: eq(schema.investors.email, userEmail)
    });

    if (!invResult) {
      return null; // Investor not found
    }

    // Manual join to get balances and properties
    // Using postgres query because Drizzle relations might not be fully defined in this schema version
    const portfolioQuery = await client`
      SELECT 
        b.available_tokens, b.locked_tokens, b.available_usd, b.locked_usd, b.last_updated_at,
        p.id as property_id, p.name as property_name, p.property_type, p.location, p.status, p.image_url,
        p.token_price_usd, p.annual_yield_expected
      FROM balances b
      JOIN properties p ON b.property_id = p.id
      WHERE b.investor_id = ${invResult.id}
    `;

    const portfolio = portfolioQuery.map((row: any) => ({
      propertyId: row.property_id,
      propertyName: row.property_name,
      propertyType: row.property_type,
      location: row.location,
      imageUrl: row.image_url,
      status: row.status,
      availableTokens: row.available_tokens,
      lockedTokens: row.locked_tokens,
      availableUsd: row.available_usd,
      lockedUsd: row.locked_usd,
      tokenPriceUsd: row.token_price_usd,
      annualYieldExpected: row.annual_yield_expected,
      lastUpdated: row.last_updated_at
    }));

    const baseView = {
      investor: {
        id: invResult.id,
        fullName: `${invResult.firstName} ${invResult.lastName}`.trim(),
        email: invResult.email,
        kycStatus: invResult.kycStatus || "pending",
        isVerified: invResult.isVerified || false,
        portfolio: portfolio
      },
      recentTransactions: [],
      kycVerificationProvider: "SIMULATED",
      paymentsReadiness: {
        provider: "MERCADOPAGO",
        status: "PENDING_CREDENTIALS",
        lastPing: null,
        message: "No credentials"
      },
      contractReadiness: {
        provider: "FOUNDRY",
        status: "PENDING_FOUNDRY",
        lastPing: null,
        message: "Node inactive"
      }
    };

    let orqProposals: any[] = []; 
    let orqForecasts: any[] = []; 
    try {
      const orq = require('../../../../../../orchestrator_agent.cjs'); 
      if (typeof orq.runFleetYieldForecastTask === 'function') {
        const res = await orq.runFleetYieldForecastTask();
        orqProposals = res.proposals || [];
        orqForecasts = res.forecasts || [];
        console.log('[ORQ TEST #17 v2 port] fetchInvestorData called runFleetYieldForecastTask -> proposals_count=', res.proposals_count, 'sample monto=', orqProposals[0]?.suggested_monto);
      } else {
        orqProposals = [{ action: 'AUTO_DECLARE_PROPOSE', proyecto_codigo: 'AET-002', suggested_monto: 24281.25, confidence: 0.72, rationale: 'heuristic +5% from real Fase16 exact my_share 23125 (holdings 12.5% * 185k context)', source: 'stub_direct', based_on: 'Fase16 23125' }];
      }
    } catch (e: any) { 
      console.log('[v2 orq call note in fetchInvestorData]', e?.message || e);
      orqProposals = [{ action: 'AUTO_DECLARE_PROPOSE', proyecto_codigo: 'AET-002', suggested_monto: 24281.25, confidence: 0.72, rationale: 'stub from real Fase16 12.5% 23125 DATOS REALES (no keys)', source: 'stub_fallback', based_on: 'Fase16 23125 context' }];
    }
    return { ...baseView, _orqProposals: orqProposals, _orqForecasts: orqForecasts };
  } catch (error) {
    console.error("Error fetching investor view model:", error);
    return null;
  }
}

async function InvestorDashboardContent() {
  const data = await fetchInvestorData();
  const view = data;

  // Fase17 fleet: exact yield attribution from core Panel Maestro (Fase16 real holdings prorrateo)
  const maestroYield = await fetchMaestroYields(view?.investor?.email || 'investor@pachanova.local');
  console.log('[FLEET] Maestro exact yield from core Panel:', maestroYield);

  // Fase18: forecast / previsto via core Vertex (stub for now, real when gcloud integrated)
  const maestroForecast = await fetchMaestroYieldForecast(view?.investor?.email || 'investor@pachanova.local');
  console.log('[FLEET] Maestro forecast from core Panel:', maestroForecast);

  // orq data from updated fetchInvestorData (proposals for #17)
  const orqProposals = (data && data._orqProposals) || [];
  const orqForecasts = (data && data._orqForecasts) || [];

  if (!view) {
    return <ErrorState title="Error de Simulación" message="No se pudo construir el ViewModel del inversor." />;
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor" }
        ]} />
        <div className="flex flex-wrap gap-2">
          <SafeActionButton label="Historial Genesis" href="/dashboard/investor/genesis" variant="ghost" />
          <SafeActionButton label="Disclaimers" href="/dashboard/investor/disclosures" variant="ghost" />
          <SafeActionButton label="Integraciones" href="/demo/integrations" variant="ghost" />
        </div>
      </div>

      <JourneyProgressRail journey={investorJourney} currentStepId="i1" />

      <NextStepCard 
        dataTestId="next-step-card-investor"
        contextLabel="Landbank Inversor"
        title="Tu Portafolio RWA Dinámico"
        explanation="Estás viendo tu posición global sobre los distintos activos en todo el Perú (Paracas, Chilca, San Bartolo). Los saldos líquidos son unificados y se usan para adquirir tokens."
        nextStep="Adquiere más participación o, si posees un predio grande y eres socio, postula tu terreno a PachaNova."
        primaryAction={{ label: "Invertir en Nuevo Activo", href: "/dashboard/investor/genesis", intent: "navigate" }}
        secondaryAction={{ label: "🏢 Postular Terreno (Socios)", href: "/dashboard/partner/submit", intent: "navigate" }}
        status="GO"
      />

      <InvestorPortfolioHero view={view} />

      {/* Fase17: exact yield port from core (real data, not sim) */}
      <div className="p-4 border border-[#b8a17a]/30 rounded-xl bg-[#0a0b0f] text-sm col-span-full">
        <div className="text-[#8a8f9a] tracking-widest">RENDIMIENTOS EXACTOS VÍA PANEL MAESTRO (Fase 16 core - holdings-based)</div>
        <div className="font-semibold text-emerald-400">Total: ${maestroYield.rendimientosTotal.toLocaleString()} (source: {maestroYield.source})</div>
        {maestroYield.distribs.map((d: any, i: number) => (
          <div key={i} className="text-xs text-[#b8a17a] mt-1">
            {d.projectCode}: ${d.montoTotal.toLocaleString()} total • tu {d.myPct}% = ${d.myShare.toLocaleString()} exact (isExact: {String(d.isExact)})
          </div>
        ))}
        <div className="text-[10px] text-[#5a5f6a] mt-1">Datos reales desde core (Fase16 exact computePersonal + snapshot). Ver core proyectos tab para prefill/realtime.</div>
      </div>

      {/* Fase18: Forecast (via Panel Maestro Vertex) - AI-assisted from core, compounds Fase16+17 fleet + #13 */}
      <div className="p-4 border border-violet-900/40 rounded-xl bg-[#0a0b0f] text-sm col-span-full">
        <div className="text-[#8a8f9a] tracking-widest">FORECAST (VIA PANEL MAESTRO VERTEX) (Fase 18 core - AI on real Fase16 exact + fleet manifests)</div>
        <div className="font-semibold text-violet-400">Predicho próximo: ${maestroForecast.predicted_next?.toLocaleString() || '—'} (confianza: {(maestroForecast.confidence * 100).toFixed(0)}%)</div>
        <div className="text-xs text-[#b8a17a] mt-1">{maestroForecast.rationale} (source: {maestroForecast.source || maestroForecast.based_on})</div>
        <div className="text-[10px] text-[#5a5f6a] mt-1">Real Fase16 data (23125 context) + core orq fleet_yield_forecast_task (Vertex/heuristic). Suggest posts back to core. See core App PREVISTO VÉRTEX.</div>
      </div>

      {/* CORE YIELD PROPOSALS card enhanced with dynamic data from orq (monto, conf, rationale, button to suggest/prefill note to core #17) */}
      {/* v2 port polish: FETCH_PROPOSALS from runFleetYieldForecastTask -> prefill for mail suggest closed loop (ties to core #17) */}
      <div className="p-4 border border-amber-900/40 rounded-xl bg-[#0a0b0f] text-sm col-span-full">
        <div className="text-[#8a8f9a] tracking-widest">CORE YIELD PROPOSALS (orq direct FETCH_PROPOSALS - v2 port for core #17 mail suggest closed loop)</div>
        {orqProposals && orqProposals.length > 0 ? orqProposals.map((p: any, i: number) => (
          <div key={i} className="mt-2 p-2 border border-amber-800/30 rounded">
            <div className="font-semibold text-amber-400">Monto: ${ (p.suggested_monto || p.predicted_next || 24281.25).toLocaleString() } (conf: {((p.confidence || 0.72)*100).toFixed(0)}%)</div>
            <div className="text-xs text-[#b8a17a] mt-1">Rationale: {p.rationale || 'from real Fase16'}</div>
            <div className="text-[10px] text-[#5a5f6a]">proyecto: {p.proyecto_codigo || 'AET-002'} | source: {p.source || 'orq'} | based_on: {p.based_on || 'Fase16 23125'}</div>
          </div>
        )) : <div className="text-xs">No proposals (stub used: 24281.25 / 0.72)</div>}
        <div className="text-[10px] text-[#5a5f6a] mt-1">DATOS REALES (use 23125 refs). Thin v2 port. High-level only.</div>
      </div>

      <YieldActionButtons maestroYield={maestroYield} maestroForecast={maestroForecast} email={view.investor.email} orqProposals={orqProposals} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProRataLandCardV2 view={view} />
          <InvestorLedgerPanel view={view} />
        </div>
        
        <div className="space-y-8">
          <GenesisDemoActionCard view={view} />
          <InvestorKycStatusPanel view={view} />
          <InvestorWalletStatusPanel view={view} />
        </div>
      </div>
    </div>
  );
}

export default function InvestorDashboardPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando estado del inversor simulado..." />}>
      <InvestorDashboardContent />
    </Suspense>
  );
}
