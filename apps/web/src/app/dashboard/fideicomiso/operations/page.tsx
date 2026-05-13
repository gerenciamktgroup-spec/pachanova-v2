import { RouteBreadcrumbs, SectionHeader, MissionCard, EmptyState } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";

export default function FideicomisoOperationsPage() {
  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Fideicomiso", href: "/dashboard/fideicomiso" },
          { label: "Operaciones" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Multi-Sig"
          title="Operaciones Pendientes"
          description="Gestión de propuestas de mutación on-chain."
          action={<SafeActionButton label="Proponer Operación Demo" href="/dashboard/fideicomiso" />}
        />
      </div>

      <MissionCard>
        <EmptyState 
          title="Sin Operaciones Pendientes"
          description="No hay propuestas que requieran firmas del quórum en este momento."
        />
      </MissionCard>
    </div>
  );
}
