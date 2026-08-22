import { PlannedFeature } from "@/components/product/PlannedFeature";

export const dynamic = "force-dynamic";

export default function ClientListingsPage() {
  return (
    <PlannedFeature
      title="Ofertas inmobiliarias"
      summary="Acá vas a ver lotes, departamentos en venta y unidades en alquiler. Se construye en la Fase 5, cuando el dominio de Listing exista."
      phase="Planificado · Fase 5"
      backHref="/dashboard/client"
      backLabel="Volver a mi operación"
    />
  );
}
