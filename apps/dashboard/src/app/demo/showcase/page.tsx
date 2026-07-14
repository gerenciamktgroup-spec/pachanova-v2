import { MissionCard } from "@/components/mission/MissionCard";
import { MetricTile } from "@/components/mission/MetricTile";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { IntegrationStatusBadge } from "@/components/mission/IntegrationStatusBadge";
import { CommandButton } from "@/components/mission/CommandButton";
import { PRODUCT_COPY } from "@/lib/copy/productCopy";
import { ROUTE_REGISTRY } from "@/lib/navigation/routeRegistry";
import Link from "next/link";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { operatorJourney } from "@/lib/navigation/userJourneys";
import { LandbankManagementClient } from "@/components/product/LandbankManagementClient";

export default function ShowcasePage() {
  const activeModules = ROUTE_REGISTRY.filter(r => r.section !== "demo" && r.status !== "planned");
  const plannedModules = ROUTE_REGISTRY.filter(r => r.section !== "demo" && r.status === "planned");

  return (
    <div className="space-y-8" data-testid="demo-showcase-page">
      <section data-testid="showcase-hero">
        <MissionCard className="border-pn-gold/20 bg-gradient-to-br from-pn-surface to-pn-surface-strong">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-pn-gold/10 px-2.5 py-1 text-xs font-semibold tracking-wider text-pn-gold uppercase">LOCAL DEMO</span>
              <span className="rounded bg-pn-surface-strong border border-pn-border px-2.5 py-1 text-xs font-medium text-pn-text-muted uppercase">Simulated</span>
              <span className="rounded bg-pn-surface-strong border border-pn-border px-2.5 py-1 text-xs font-medium text-pn-text-muted uppercase">No production connections</span>
            </div>
            
            <div>
              <h1 className="text-3xl font-light tracking-tighter text-pn-text sm:text-4xl md:text-5xl">
                PachaNova Landbanking <span className="font-semibold text-pn-gold">Mission Control</span> • Full Unified (single project @3000)
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-pn-text-muted">
                Demo local external-ready para tokenización inmobiliaria RWA (PachaNova Landbanking = entire PachaNova + Master 5PNC, P2P, credits, yields/flywheel, gov, orq high-level, autonomy, holograms). 
                Rich permanent demo. DATOS REALES. Master sacred. Entorno de prueba simulado, diseñado para auditoría y demostración de flujos. <span className="text-pn-gold">Ver todos los avances immediate en Landbank holograms + E2E flows + yields/gov/borrow expansions abajo. Hard refresh after start.</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="#phase4-hologram-landbank">
                  <CommandButton variant="primary" className="text-sm">Ver todos los avances (holograms + E2E Master→P2P→Borrow→Claim→GovVote) →</CommandButton>
                </Link>
                <Link href="#yields-surface">
                  <CommandButton variant="ghost" className="text-sm">Full Yields Surface (expanded)</CommandButton>
                </Link>
                <Link href="#gov-surface">
                  <CommandButton variant="ghost" className="text-sm">Full Gov Surface (expanded)</CommandButton>
                </Link>
              </div>
            </div>
          </div>
        </MissionCard>
      </section>

      <JourneyProgressRail journey={operatorJourney} currentStepId="o1" />

      <NextStepCard 
        contextLabel="Showcase"
        title="Punto de Control Central"
        explanation="Estás en la sala de control principal de la demostración. Desde aquí puedes navegar a cualquier panel institucional para experimentar la vista de los distintos actores del ecosistema."
        nextStep="Selecciona el Panel Inversor para experimentar la vista del cliente final, o usa el Operador Demo para controlar los escenarios."
        primaryAction={{ label: "Abrir Operador Demo", href: "/demo/operator", intent: "navigate" }}
        secondaryAction={{ label: "Ir al Panel Inversor", href: "/dashboard/investor", intent: "navigate" }}
        status="GO"
      />

      <section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <MetricTile label="Total Área" value={PRODUCT_COPY.metrics.totalArea} helper="5 hectáreas" />
          <MetricTile label="Tokens Genesis" value={PRODUCT_COPY.metrics.totalTokens} />
          <MetricTile label="Relación" value={PRODUCT_COPY.metrics.conversionRule} />
          <MetricTile label="Precio Demo" value={PRODUCT_COPY.metrics.genesisPrice} />
          <MetricTile label="Entorno" value="Local Sandbox" helper="Isolated" trend="up" />
        </div>
      </section>

      {/* Fase 6 Polish: Phase 4 Visuals & Holograms + full E2E Landbank flows (Master/P2P/borrow/claim/gov) - high visibility + 'ver todos los avances' immediate entry */}
      <section data-testid="phase4-hologram-landbank" id="phase4-hologram-landbank">
        <LandbankManagementClient />
      </section>

      {/* Post-F6 expansion: full yields page surface (E2E + hologram panels + per-PNC ver avances + orq exercised) */}
      <section id="yields-surface" data-testid="yields-surface-expanded">
        <MissionCard title="FULL YIELDS / FLYWHEEL SURFACE (Post-F6 Expanded E2E + Holograms)">
          <div className="text-xs text-pn-text-muted mb-3">Expanded from Landbank: per-PNC yields/flywheel interactive. Real orq data. Addl cross links + ver avances buttons. ORQ high-level bridge: exercised badges + cycle notes (no core orq change).</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            {["PAR","VIV","YLD","HTL","MIX"].map((c,i) => (
              <div key={i} className="p-2 border border-pn-border rounded text-xs bg-pn-surface">
                <div className="font-mono text-pn-gold">{c} • Fase {16+i}</div>
                <div>Yield eff live • Flywheel claim 23125 → compound</div>
                <div className="mt-1 flex gap-1">
                  <span className="px-1 bg-emerald-900/30 text-emerald-300 rounded text-[9px]">ORQ EXERCISED</span>
                  <Link href="/demo/showcase#phase4-hologram-landbank" className="underline text-pn-gold/70 text-[9px]">ver avances</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap text-xs">
            <Link href="/dashboard/investor/ledger" className="underline">Ledger (yields history)</Link>
            <Link href="/dashboard/investor/marketplace" className="underline">Market (PNC ties)</Link>
            <span className="text-pn-sage">+ per-PNC claim/compound E2E in Landbank holograms above</span>
            <span className="px-1.5 py-0.5 bg-emerald-900/30 text-emerald-300 rounded">ORQ CYCLE NOTES: F47/48/16 exercised</span>
          </div>
        </MissionCard>
      </section>

      {/* Post-F6 expansion: full gov surface + borrow E2E + more per-PNC ver avances */}
      <section id="gov-surface" data-testid="gov-surface-expanded">
        <MissionCard title="FULL GOV + BORROW E2E SURFACE (Post-F6 Expanded + Hologram Panels)">
          <div className="text-xs text-pn-text-muted mb-3">Expanded E2E flows + hologram panels to gov/borrow surfaces. More &quot;ver avances&quot; + cross links per PNC. Investor hero/portfolio interactive. Marketplace orderbook PNC ties. Rich permanent.</div>
          <div className="mb-3 p-3 border border-pn-border rounded bg-pn-surface text-xs">
            <div>Gov: Fase36 quorum PASSED power 2250 • orq exercised • Master override gate</div>
            <div className="mt-1">Borrow (Fase9): net 68112.5 - debt health 1.65 • per PNC E2E buttons in Landbank</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {["PAR","VIV","YLD"].map(c => <Link key={c} href="/demo/showcase#phase4-hologram-landbank" className="px-1.5 py-0.5 border border-pn-gold/30 rounded text-pn-gold/80 hover:bg-pn-gold/10">ver avances {c} (gov/borrow)</Link>)}
              <Link href="/dashboard/investor" className="underline">Investor portfolio (more interactive)</Link>
              <Link href="/dashboard/investor/marketplace?pnc=PAR" className="underline">Orderbook +PNC ties</Link>
              <span className="px-1.5 py-0.5 bg-emerald-900/30 text-emerald-300 rounded">ORQ EXERCISED F36/9/53</span>
            </div>
          </div>
          <div className="text-[10px] text-pn-gold/70">All surfaces now have hologram panels, per-PNC ver avances buttons, orq Fase refs + exercised badges. Full E2E visible locally immediately. Hard refresh recommended.</div>
        </MissionCard>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section data-testid="showcase-navigation-grid">
            <SectionHeader title="Módulos Activos" description="Navega a través de los dashboards interactivos." />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeModules.map(module => (
                <MissionCard key={module.id} className="flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-pn-text">{module.label}</h3>
                      <IntegrationStatusBadge status={module.status.includes("pending") ? "PENDING_CREDENTIALS" : "SIMULATED"} />
                    </div>
                    <p className="text-sm text-pn-text-soft mb-6">{module.description}</p>
                  </div>
                  <Link href={module.path || "#"}>
                    <CommandButton variant="primary" className="w-full justify-center">
                      {module.primaryAction || `Abrir ${module.label}`}
                    </CommandButton>
                  </Link>
                </MissionCard>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Próximas Fases (Planned)" description="Módulos en diseño para futuras versiones de la demo." />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plannedModules.map(module => (
                <MissionCard key={module.id} className="opacity-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-md font-medium text-pn-text">{module.label}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-pn-text-muted bg-pn-surface-strong px-2 py-1 rounded">Planned</span>
                  </div>
                  <p className="text-xs text-pn-text-soft">{module.description}</p>
                </MissionCard>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section data-testid="showcase-status-summary">
            <MissionCard title="Integrations Readiness">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-pn-text-soft">Local Database</span>
                  <IntegrationStatusBadge status="CONNECTED" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-pn-text-soft">MercadoPago Checkout</span>
                  <IntegrationStatusBadge status="PENDING_CREDENTIALS" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-pn-text-soft">Foundry Smart Contracts</span>
                  <IntegrationStatusBadge status="PENDING_FOUNDRY" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-pn-text-soft">Internal UI (Mission Control)</span>
                  <IntegrationStatusBadge status="CONNECTED" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-pn-text-soft">Production Environment</span>
                  <IntegrationStatusBadge status="NO-GO" />
                </div>
                <div className="pt-4 border-t border-pn-border">
                  <Link href="/demo/integrations">
                    <CommandButton variant="outline" className="w-full justify-center">Ver Matriz Completa</CommandButton>
                  </Link>
                </div>
              </div>
            </MissionCard>
          </section>
        </div>
      </div>
    </div>
  );
}
