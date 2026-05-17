import { RouteBreadcrumbs } from "@/components/mission/RouteBreadcrumbs";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { MissionCard } from "@/components/mission/MissionCard";
import { EmptyState } from "@/components/mission/StateComponents";

export default function AdminAuditPage() {
  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Consola Admin", href: "/dashboard/admin" },
          { label: "Auditoría" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Seguridad"
          title="Logs de Auditoría"
          description="Registro inmutable de eventos del sistema y mutaciones simuladas."
        />
      </div>

      <MissionCard>
        <EmptyState 
          title="Sin Eventos"
          description="Aún no hay logs de auditoría en este entorno."
        />
      </MissionCard>
    </div>
  );
}
