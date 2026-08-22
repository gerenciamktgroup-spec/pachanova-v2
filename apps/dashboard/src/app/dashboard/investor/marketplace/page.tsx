import { QuarantinedFeature } from "@/components/product/QuarantinedFeature";

export const dynamic = "force-dynamic";

export default function MarketplacePage() {
  return (
    <QuarantinedFeature
      title="Mercado P2P de fracciones"
      summary="No hay mercado secundario de tokens. El catálogo activo es de proyectos a cofinanciar; la venta al cliente es de inmuebles, no de fracciones."
    />
  );
}
