import { MissionCard } from "@/components/mission/MissionCard";
import { MetricTile } from "@/components/mission/MetricTile";
import { RiskBadge } from "@/components/mission/RiskBadge";
import { IntegrationStatusBadge } from "@/components/mission/IntegrationStatusBadge";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { TimelineRail } from "@/components/mission/TimelineRail";
import { EmptyState, LoadingState, ErrorState } from "@/components/mission/StateComponents";
import { LegalTrustCard } from "@/components/mission/LegalTrustCard";
import { ExternalReadyNotice } from "@/components/mission/ExternalReadyNotice";
import { ReportLinkCard } from "@/components/mission/ReportLinkCard";
import { CommandButton } from "@/components/mission/CommandButton";
import { RouteBreadcrumbs } from "@/components/mission/RouteBreadcrumbs";
import { ShieldCheck, Activity } from "lucide-react";

export default function DesignSystemPreview() {
  return (
      <div className="space-y-12 pb-24">
        <div>
          <RouteBreadcrumbs items={[
            { label: "Demo" },
            { label: "Design System Playground" }
          ]} className="mb-4" />
          <SectionHeader 
            eyebrow="Mission Control"
            title="Design System & Components"
            description="Librería de componentes UI para PachaNova Institutional RWA."
            action={<CommandButton variant="primary">Deploy Contracts</CommandButton>}
          />
        </div>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-pn-text-muted uppercase tracking-widest border-b border-pn-border pb-2">Status Badges & Ribbons</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <RiskBadge level="GO" />
            <RiskBadge level="MEDIUM" />
            <RiskBadge level="BLOCKER" />
            <IntegrationStatusBadge status="CONNECTED" />
            <IntegrationStatusBadge status="READY-BUT-DISABLED" />
            <IntegrationStatusBadge status="PENDING_CREDENTIALS" />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-pn-text-muted uppercase tracking-widest border-b border-pn-border pb-2">Cards & Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MissionCard animated>
              <MetricTile 
                label="Total Tokens" 
                value="500,000" 
                unit="PACHA" 
                helper="Genesis Emission" 
              />
            </MissionCard>
            <MissionCard variant="elevated" animated>
              <MetricTile 
                label="Superficie Inmueble" 
                value="50,000" 
                unit="m²" 
                helper="1 PACHA = 0.1 m²" 
                trend="up"
              />
            </MissionCard>
            <MissionCard variant="warning" animated>
              <MetricTile 
                label="Genesis Price" 
                value="8.40" 
                unit="USD" 
                helper="Demo Simulated Value" 
              />
            </MissionCard>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-pn-text-muted uppercase tracking-widest border-b border-pn-border pb-2">States</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LoadingState message="Inicializando oráculo..." />
            <EmptyState title="Sin Transacciones" description="No hay eventos registrados en este bloque." />
            <ErrorState title="Fallo de Red" message="No se pudo conectar con el nodo Foundry local." />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-pn-text-muted uppercase tracking-widest border-b border-pn-border pb-2">Institutional Components</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LegalTrustCard />
            <div className="space-y-4">
              <ExternalReadyNotice />
              <ReportLinkCard 
                title="Integration Readiness Report" 
                desc="Auditoría de conexiones externas"
                href="/demo/reports"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-pn-text-muted uppercase tracking-widest border-b border-pn-border pb-2">Timeline</h3>
          <div className="max-w-md">
            <MissionCard>
              <TimelineRail items={[
                { id: "1", title: "Smart Contracts Deploy", status: "completed", time: "10:00:00", icon: <ShieldCheck className="h-4 w-4 text-pn-success" />, description: "" },
                { id: "2", title: "Multi-Sig Fideicomiso", status: "current", description: "2/3 firmas pendientes para liberación de fondos." },
                { id: "3", title: "Oráculo de Valuación", status: "pending", description: "" }
              ]} />
            </MissionCard>
          </div>
        </section>
      </div>
  );
}
