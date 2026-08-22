import { PlannedFeature } from "@/components/product/PlannedFeature";

export const dynamic = "force-dynamic";

export default function ClientReservationsPage() {
  return (
    <PlannedFeature
      title="Reservas"
      summary="Separación de un lote o unidad, con plazo y estado. Fase 5."
      phase="Planificado · Fase 5"
      backHref="/dashboard/client"
      backLabel="Volver a mi operación"
    />
  );
}
