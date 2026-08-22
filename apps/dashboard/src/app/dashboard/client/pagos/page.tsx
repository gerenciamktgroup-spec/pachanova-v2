import { PlannedFeature } from "@/components/product/PlannedFeature";

export const dynamic = "force-dynamic";

export default function ClientPaymentsPage() {
  return (
    <PlannedFeature
      title="Pagos"
      summary="Iniciales, cuotas y renta de tu operación. Distinto de los aportes de capital del inversor."
      phase="Planificado · Fase 5"
      backHref="/dashboard/client"
      backLabel="Volver a mi operación"
    />
  );
}
