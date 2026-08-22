import { PlannedFeature } from "@/components/product/PlannedFeature";

export const dynamic = "force-dynamic";

export default function ClientContractsPage() {
  return (
    <PlannedFeature
      title="Contratos"
      summary="Tu minuta, compraventa o arrendamiento. El cap table de inversores no entra en este panel."
      phase="Planificado · Fase 5"
      backHref="/dashboard/client"
      backLabel="Volver a mi operación"
    />
  );
}
