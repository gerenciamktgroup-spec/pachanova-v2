import { RouteBreadcrumbs, SectionHeader, MissionCard, EmptyState } from "@/components/mission";

export default function AdminIntegrationsPage() {
  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Consola Admin", href: "/dashboard/admin" },
          { label: "Integraciones" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Técnico"
          title="Estado de Integraciones"
          description="Monitor de conexiones con proveedores externos."
        />
      </div>

      <MissionCard>
        <EmptyState 
          title="No Data"
          description="Módulo de integraciones en inicialización."
        />
      </MissionCard>
    </div>
  );
}
