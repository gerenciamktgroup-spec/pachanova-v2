import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { Suspense } from "react";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

async function fetchOperatorData() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");
    const role = user.app_metadata?.role as string | undefined;
    if (role !== "admin" && role !== "operator") redirect("/unauthorized"); // Admin y Operador tienen acceso

    return { role };
  } catch (error) {
    console.error("Error fetching operator view model:", error);
    return null;
  }
}

async function OperatorDashboardContent() {
  const data = await fetchOperatorData();

  if (!data) {
    return <ErrorState title="Error" message="No se pudo construir la vista del operador." />;
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Consola Operador" }
        ]} />
      </div>

      <div className="bg-pn-surface border border-pn-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-pn-text mb-2">Bienvenido, Operador</h2>
        <p className="text-sm text-pn-text-soft mb-6">
          Desde esta consola puedes validar los procesos KYC, monitorear transacciones pendientes y gestionar tickets de soporte.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-pn-bg border border-pn-border rounded-lg hover:border-pn-gold transition-colors cursor-pointer">
            <h3 className="font-semibold text-white">Validación KYC</h3>
            <p className="text-sm text-pn-text-muted mt-2">Revisar 12 documentos pendientes.</p>
          </div>
          <div className="p-6 bg-pn-bg border border-pn-border rounded-lg hover:border-pn-gold transition-colors cursor-pointer">
            <h3 className="font-semibold text-white">Transacciones</h3>
            <p className="text-sm text-pn-text-muted mt-2">5 depósitos requieren aprobación manual.</p>
          </div>
          <div className="p-6 bg-pn-bg border border-pn-border rounded-lg hover:border-pn-gold transition-colors cursor-pointer">
            <h3 className="font-semibold text-white">Soporte</h3>
            <p className="text-sm text-pn-text-muted mt-2">0 tickets abiertos por inversores.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OperatorDashboardPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando consola de operador..." />}>
      <OperatorDashboardContent />
    </Suspense>
  );
}
