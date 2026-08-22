import { QuarantinedFeature } from "@/components/product/QuarantinedFeature";

export const dynamic = "force-dynamic";

export default function BorrowPage() {
  return (
    <QuarantinedFeature
      title="Préstamos DeFi"
      summary="El crédito contra participaciones queda para una etapa posterior. Hoy el inversor cofinancia proyectos, no pignora tokens."
    />
  );
}
