import { Suspense } from "react";
import { RouteBreadcrumbs, LoadingState } from "@/components/mission";
import LandbankManagementClient from "./LandbankManagementClient";
import LandbankAnalytics from "./LandbankAnalytics";

export const dynamic = "force-dynamic";

export default function LandbankAdminPage() {
  return (
    <div className="space-y-6">
      <RouteBreadcrumbs
        items={[{ label: "Admin" }, { label: "Land Banking" }]}
      />
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
              Proyectos — landbanking, venta y renta
            </h2>
            <p className="text-sm text-white/50">
              Hub operativo del administrador. Cada proyecto es un giro: tierra para plusvalía, edificio para venta, o edificio para alquiler. Tokenización y P2P están en cuarentena.
            </p>
            <p className="text-[10px] text-[#c5a46d]/70 mt-1">Canon 2026-08-22 · el inversor cofinancia · el cliente compra o arrienda · este panel opera el proyecto.</p>
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
            PachaNova — cofinanciamiento de proyectos
          </div>
          <div className="text-sm text-white/70">
            Ciclo operativo: estructurar → cofinanciar → ejecutar hitos → vender o rentar al cliente →
            distribuir resultados. Sin tokens en esta etapa.
          </div>
        </div>

        <div className="mb-6 p-4 border border-[#c5a46d]/30 rounded-xl bg-[#050608]">
          <div className="text-xs uppercase tracking-widest text-[#c5a46d] mb-1">Canon · cofinanciamiento</div>
          <div className="text-sm text-white/80">
            Un proyecto, un tipo, un ciclo. Landbanking (comprar barato / vender caro), edificio en venta, edificio en renta.
            El admin opera. El inversor aporta. El cliente compra o arrienda. Token, P2P y chain no se ofrecen aquí.
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
