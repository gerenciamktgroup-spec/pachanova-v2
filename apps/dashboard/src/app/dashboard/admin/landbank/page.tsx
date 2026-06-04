import { Suspense } from "react";
import { RouteBreadcrumbs, LoadingState } from "@/components/mission";
import LandbankManagementClient from "./LandbankManagementClient";
import LandbankAnalytics from "./LandbankAnalytics";

export const dynamic = "force-dynamic";

export default function LandbankAdminPage() {
  return (
    <div className="space-y-6">
      <RouteBreadcrumbs
        customSegments={["Admin", "Land Banking"]}
      />
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
              🏦 Motor Land Banking (PachaNova Dashboard - Single Unified Project)
            </h2>
            <p className="text-sm text-white/50">
              Gestión completa del ciclo de vida de activos RWA tokenizados (P2P + Créditos + Master Control integrado del core).{" "}
              <span className="text-[#c5a46d]">coming_soon → funding → funded → trading → liquidated</span>
            </p>
            <p className="text-[10px] text-[#c5a46d]/70 mt-1">Un solo proyecto final. Master edita TODO (5 PNC Perú multi-product: vivienda/alquiler/hotel/desarrollo). orq + DB real. Ver investor para P2P marketplace + borrow/créditos.</p>
          </div>
          <a
            href="/dashboard/admin/properties"
            className="text-xs text-white/40 hover:text-white/70 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            Vista clásica →
          </a>
        </div>

        {/* Key Stats Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-[#c5a46d]/10 to-emerald-500/10 border border-[#c5a46d]/20 rounded-xl">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
            Sistema Land Banking Pachanova — Motor Autónomo RWA
          </div>
          <div className="text-sm text-white/70">
            Cada activo en el portafolio pasa por el ciclo completo de tokenización,
            fundraising, trading on-chain y distribución de rendimientos. Use las
            tarjetas para avanzar el ciclo de vida o distribuir yields en lote.
          </div>
        </div>

        <Suspense fallback={<LoadingState message="Cargando Analíticas..." />}>
          <LandbankAnalytics />
        </Suspense>

        <Suspense fallback={<LoadingState message="Cargando Land Banking..." />}>
          <LandbankManagementClient />
        </Suspense>
      </div>
    </div>
  );
}
