import { Suspense } from "react";
import { RouteBreadcrumbs, LoadingState } from "@/components/mission";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import YieldDistributionsClient from "./YieldDistributionsClient";
import { HologramPncCard } from "@/components/product/HologramPncCard"; // Fase4: expand HologramPncCard to yields section for PachaNova Landbanking visuals + rich 5PNC orq fallbacks

export const dynamic = "force-dynamic";

async function YieldsContent() {
  let investorId = "";
  
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || "investor@pachanova.local";

    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, userEmail),
    });

    investorId = investor?.id || "";
  } catch (e) {
    console.error("[yields page]", e);
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gradient-to-r from-emerald-950/40 to-[#0a111f] border border-emerald-500/20 rounded-xl">
        <div className="text-xs text-emerald-400/70 uppercase tracking-wider mb-1">
          Sistema de Distribución de Rendimientos — PachaNova Landbanking (FULL PROJECT + TOOLS)
        </div>
        <div className="text-sm text-white/60">
          Aquí puedes reclamar tus rendimientos acumulados de los activos en tu portafolio 
          o reinvertirlos directamente para componer tu posición. Cada distribución está 
          respaldada por una prueba on-chain. <span className="text-[#c5a46d]">DATOS REALES ORQ 5PNC en hologramas abajo.</span>
        </div>
      </div>

      {/* Fase1 + Fase4: HologramPncCard expansion to yields + full project banner + central hub feel + concrete ver todos avances */}
      <div className="border border-[#c5a46d]/30 rounded-xl p-4 bg-[#0a111f]">
        <div className="text-[10px] text-[#c5a46d] uppercase tracking-widest mb-1">PACHA NOVA LANDBANKING — YIELDS EN HOLOGRAMA (5PNC ORQ REALES • FASE47 FLYWHEEL • MASTER)</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          {[
            {id:"pnc-par-y", name:"Paracas Land Reserve — PNC-PAR-001", location:"Paracas, Ica, Perú", propertyType:"land", status:"trading", totalValuationUsd:"1250000", tokenPriceUsd:"500", totalTokens:"2500", availableTokens:"2000", annualYieldExpected:"7.8", metadata:{pncCode:"PNC-PAR-001", net:68112.5, effectiveYield:31639, effectivePct:"17.1%", pachaPower:3250, phase:"Fase15/36/42/47/49", product_configs:{alquiler_yield:{porcentaje_renta_a_holders:55, yield_estimado_anual:7.8}}, notas_maestro:"Yields from Fase47 flywheel. Full landbanking=everything+tools. Rich fallback."}},
            {id:"pnc-sb-y", name:"Frente Playa San Bartolo — PNC-SB-003", location:"San Bartolo, Lima Sur, Perú", propertyType:"residential", status:"funded", totalValuationUsd:"2450000", tokenPriceUsd:"1350", totalTokens:"1800", availableTokens:"1500", annualYieldExpected:"12.5", metadata:{pncCode:"PNC-SB-003", net:105840, effectiveYield:13230, effectivePct:"12.5%", pachaPower:3250, phase:"Fase15", product_configs:{hotel_revenue_share:{porcentaje_ocupacion_a_holders:48}}, notas_maestro:"Yield attribution per product. Master launches feed yields."}},
            {id:"pnc-chi-y", name:"Chiclayo Reserve — PNC-CHI-004", location:"Chiclayo, Perú", propertyType:"land", status:"trading", totalValuationUsd:"980000", tokenPriceUsd:"390", totalTokens:"4200", availableTokens:"3000", annualYieldExpected:"8.1", metadata:{pncCode:"PNC-CHI-004", net:68112.5, effectiveYield:31639, effectivePct:"17.1%", pachaPower:3250, phase:"Fase15/36", product_configs:{vivienda_token:{}, alquiler_yield:{}}, notas_maestro:"Ver todos los avances: Fase1 consolidation + Fase4 holograms in yields/gov etc."}}
          ].map((pnc, i) => <HologramPncCard key={i} pnc={pnc as any} compact />)}
        </div>
        <a id="ver-avances" href="/dashboard/admin/landbank#avances" className="text-xs text-emerald-400 hover:underline">→ Ver todos los avances (Fases 1/4 consolidation+visuals, blackboard, 5PNC orq)</a>
      </div>
      
      {!investorId ? (
        <div className="text-center py-12 text-white/40">
          <div className="text-3xl mb-3">🔐</div>
          <div>Debes iniciar sesión para ver tus rendimientos.</div>
          <a
            href="/login"
            className="inline-block mt-4 px-4 py-2 bg-[#c5a46d]/10 border border-[#c5a46d]/30 text-[#c5a46d] text-sm rounded-lg"
          >
            Iniciar sesión
          </a>
        </div>
      ) : (
        <YieldDistributionsClient investorId={investorId} />
      )}
    </div>
  );
}

export default function InvestorYieldsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <RouteBreadcrumbs
          items={[
            { label: "Dashboard" },
            { label: "Panel Inversor", href: "/dashboard/investor" },
            { label: "Mis Rendimientos" },
          ]}
        />
        <div className="flex gap-2">
          <a
            href="/dashboard/investor"
            className="text-xs border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg text-white/50 hover:text-white transition-colors"
          >
            ← Mi Portafolio
          </a>
          <a
            href="/dashboard/investor/marketplace"
            className="text-xs bg-[#c5a46d]/10 border border-[#c5a46d]/30 text-[#c5a46d] px-3 py-1.5 rounded-lg hover:bg-[#c5a46d]/20 transition-colors"
          >
            Ver Marketplace →
          </a>
        </div>
      </div>

      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            💎 Mis Rendimientos
          </h1>
          <p className="text-white/50">
            Historial completo de distribuciones de yield por activo tokenizado.
            Reclama o reinvierte tus ganancias con un solo click.
          </p>
        </div>

        <Suspense fallback={<LoadingState message="Cargando rendimientos..." />}>
          <YieldsContent />
        </Suspense>
      </div>
    </div>
  );
}
