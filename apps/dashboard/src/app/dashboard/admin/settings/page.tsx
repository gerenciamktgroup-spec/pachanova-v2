export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, SectionHeader, ErrorState } from "@/components/mission";
import { AdminSettingsPanel } from "@/components/product";
import { db } from "@/server/db";
import { requireRole } from "@/utils/auth/requireRole";

export default async function AdminSettingsPage() {
  await requireRole(["admin"]);

  try {
    const params = await db.query.systemParameters.findMany();
    const formattedParams = params.map(p => ({
      key: p.key,
      value: p.value,
      description: p.description,
      updatedAt: p.updatedAt.toISOString(),
    }));

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
  } catch (error: any) {
    console.error("Error loading settings page:", error);
    return <ErrorState title="Error de Carga" message="No se pudieron cargar las configuraciones del sistema." />;
  }
}
