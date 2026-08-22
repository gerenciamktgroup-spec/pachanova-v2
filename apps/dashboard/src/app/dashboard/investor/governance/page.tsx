import { QuarantinedFeature } from "@/components/product/QuarantinedFeature";

export const dynamic = "force-dynamic";

export default function GovernancePage() {
  return (
    <QuarantinedFeature
      title="Gobernanza DAO"
      summary="No hay votación on-chain en esta etapa. Las decisiones de proyecto las opera el administrador con trazabilidad."
    />
  );
}
