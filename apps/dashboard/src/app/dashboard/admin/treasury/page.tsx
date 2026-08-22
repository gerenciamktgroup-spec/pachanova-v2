import { QuarantinedFeature } from "@/components/product/QuarantinedFeature";

export default function TreasuryPage() {
  return (
    <QuarantinedFeature
      title="Tesorería token"
      summary="La tesorería on-chain y la liquidación de tokens están en cuarentena. El admin opera aportes, hitos y trazabilidad del proyecto."
      backHref="/dashboard/admin"
      backLabel="Volver al panel admin"
    />
  );
}
