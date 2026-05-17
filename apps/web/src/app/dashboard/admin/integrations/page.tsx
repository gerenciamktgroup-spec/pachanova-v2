import { RouteBreadcrumbs } from "@/components/mission/RouteBreadcrumbs";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { MissionCard } from "@/components/mission/MissionCard";
import { EmptyState } from "@/components/mission/StateComponents";

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
