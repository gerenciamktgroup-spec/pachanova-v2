import { QuarantinedFeature } from "@/components/product/QuarantinedFeature";

export const dynamic = "force-dynamic";

export default function AdminGovernancePage() {
  return (
    <QuarantinedFeature
      title="Gobernanza admin"
      summary="No se emiten propuestas DAO. La operación del proyecto vive en Proyectos, Aprobaciones y Trazabilidad."
      backHref="/dashboard/admin"
      backLabel="Volver al panel admin"
    />
  );
}
