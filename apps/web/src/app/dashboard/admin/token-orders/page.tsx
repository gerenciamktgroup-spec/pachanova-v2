import { RouteBreadcrumbs } from "@/components/mission/RouteBreadcrumbs";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { MissionCard } from "@/components/mission/MissionCard";
import { EmptyState } from "@/components/mission/StateComponents";

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
