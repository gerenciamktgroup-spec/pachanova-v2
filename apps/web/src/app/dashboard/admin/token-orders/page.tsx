import { RouteBreadcrumbs, SectionHeader, MissionCard, EmptyState } from "@/components/mission";

export default function AdminTokenOrdersPage() {
  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Consola Admin", href: "/dashboard/admin" },
          { label: "Órdenes Token" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Transaccional"
          title="Órdenes de Adquisición"
          description="Supervisión de intentos Genesis simulados."
        />
      </div>

      <MissionCard>
        <EmptyState 
          title="Sin Órdenes"
          description="Aún no hay intentos de adquisición registrados."
        />
      </MissionCard>
    </div>
  );
}
