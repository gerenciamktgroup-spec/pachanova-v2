export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader } from "@/components/mission";
import { AdminSettingsPanel } from "@/components/product";
import { db } from "@/server/db";
import { requireRole } from "@/utils/auth/requireRole";

const FALLBACK_PARAMS = [
  {
    key: "KYC_PROVIDER",
    value: "SIMULATED",
    description: "Proveedor de verificación de identidad activo (SIMULATED / SUMSUB / DIDIT)",
    updatedAt: new Date().toISOString(),
  },
  {
    key: "GENESIS_TOKEN_PRICE_USD",
    value: "8.40",
    description: "Precio unitario por token PACHA en la Ronda Génesis",
    updatedAt: new Date().toISOString(),
  },
  {
    key: "TRUST_QUORUM_REQUIRED",
    value: "2/3",
    description: "Quórum reforzado requerido para ejecución de resoluciones fiduciarias",
    updatedAt: new Date().toISOString(),
  },
  {
    key: "ORACLE_VALUATION_USD",
    value: "42000000",
    description: "Tasación pericial oficial de la tierra en San Bartolo (500.000 m²)",
    updatedAt: new Date().toISOString(),
  }
];

export default async function AdminSettingsPage() {
  await requireRole(["admin"]);

  let formattedParams = FALLBACK_PARAMS;

  try {
    const params = await db.query.systemParameters.findMany();
    if (params && params.length > 0) {
      formattedParams = params.map(p => ({
        key: p.key,
        value: p.value,
        description: p.description || "",
        updatedAt: p.updatedAt.toISOString(),
      }));
    }
  } catch (error: unknown) {
    console.warn("DB query in settings page failed, using fallback:", error);
  }

  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Consola Admin", href: "/dashboard/admin" },
          { label: "Configuración" }
        ]} className="mb-4" />
        <SectionHeader
          eyebrow="Configuración"
          title="Parámetros Globales"
          description="Controla las configuraciones runtime del sistema en tiempo real."
        />
      </div>

      <AdminSettingsPanel initialParams={formattedParams} />
    </div>
  );
}
