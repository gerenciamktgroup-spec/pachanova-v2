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
              🏦 LANDBANKING HUB — Entrada Principal (Single Unified Project)
            </h2>
            <p className="text-sm text-white/50">
              Historia clara: <span className="line-through text-white/30">beta tokenización RWA Genesis (genesis_purchases, demo actions pesados, isDemo flags)</span> → <strong className="text-[#c5a46d]">5PNC Master Landbanking actual</strong>.{" "}
              <span className="text-[#c5a46d]">coming_soon → funding → funded → trading → liquidated</span>
            </p>
            <p className="text-[10px] text-[#c5a46d]/70 mt-1"><strong>UN SOLO:</strong> Primary = landbank. Demo siempre "Modo Visual / DATOS REALES simulado" (muestra permanentemente 5PNC + orq numbers: PAR 68112.5 net @31639 eff 17.1% power 3250 Fase* etc). Genesis/beta deprecate visible en UI (schema mantenido solo para compat). Master sagrado edita TODO (5 PNC multi-product Perú). Integrado P2P + Créditos + orq + autonomy. Ver /investor para portfolio + yields + marketplace.</p>
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

        {/* Fase1: Historia clara del Hub - Consolidación beta→landbank */}
        <div className="mb-6 p-4 border border-[#c5a46d]/30 rounded-xl bg-[#050608]">
          <div className="text-xs uppercase tracking-widest text-[#c5a46d] mb-1">FASE 1 CONSOLIDACIÓN &amp; CLEANUP — HISTORIA DEL PROYECTO</div>
          <div className="text-sm text-white/80">
            <strong>De beta a uno solo:</strong> Auditoría detectó remnants (genesis_purchases, demo actions pesados, isDemo flags, genesis como primary en flujos). Ahora: <span className="text-emerald-400 font-semibold">"Uno solo"</span>. <br />
            <span className="text-white/60">Beta:</span> Tokenización RWA simple (Genesis purchases, demo heavy, flags isDemo). <span className="text-[#c5a46d] font-semibold">→ Actual:</span> 5PNC Master Landbanking (Paracas 5ha PNC-PAR-001 alquiler_yield + otros 4: SB, SEL, CHI, AET; product_configs JSONB, manual_overrides, Master console, orq real Fase9/15/36/42/47/48/49/51 con números 68112.5 net / 31639 eff / 3250 power / 23125 holder + tx fresh + gcloud/predict). <br />
            Demo marcado permanente como <strong>"Modo Visual / DATOS REALES simulado"</strong> (siempre 5PNC + orq numbers en investor/admin). Genesis/beta flows deprecate visible en UI (links, labels, banners marcados legacy; schema DB mantenido solo compatibilidad). Nav unificado + links a Hub como primary entry.
          </div>
          <div className="mt-2 text-[10px] text-emerald-400/80">Al abrir dashboard se siente "Landbanking completo" inmediatamente. Primary entry: este Hub. DATOS REALES • Master sagrado.</div>
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
