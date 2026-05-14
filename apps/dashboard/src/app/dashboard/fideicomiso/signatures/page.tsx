import { RouteBreadcrumbs, SectionHeader, MissionCard, EmptyState } from "@/components/mission";

export default function FideicomisoSignaturesPage() {
  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Fideicomiso", href: "/dashboard/fideicomiso" },
          { label: "Firmas" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Gobernanza"
          title="Auditoría de Firmas"
          description="Historial inmutable de firmas aprobadas por los miembros del quórum."
        />
      </div>

      <MissionCard>
        <EmptyState 
          title="Sin Firmas Recientes"
          description="Aún no se han completado operaciones multifirma en el entorno local."
        />
      </MissionCard>
    </div>
  );
}
