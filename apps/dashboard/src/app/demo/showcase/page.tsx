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
                PachaNova <span className="font-semibold text-pn-gold">Mission Control</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-pn-text-muted">
                Demo local external-ready para tokenización inmobiliaria RWA. 
                Entorno de prueba simulado, diseñado para auditoría y demostración de flujos.
              </p>
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
