export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, LoadingState } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { LandbankManagementClient } from "@/components/product";
import { Suspense } from "react";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { adminJourney } from "@/lib/navigation/userJourneys";
import Link from "next/link";

/**
 * Admin Landbank page (Post-F6 polish support for /admin/landbank URL).
 * Embeds full LandbankManagementClient + holograms + E2E for yields/gov/borrow/5PNC.
 * High-level only. Full project identity + rich permanent demo banners.
 * Datos de referencia persistidos en el demo; reglas Master visibles.
 * Single unified project.
 */

async function AdminLandbankContent() {
  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Consola Admin", href: "/dashboard/admin" },
          { label: "Landbank (Holograms + E2E)" }
        ]} />
        <div className="flex flex-wrap gap-2">
          <SafeActionButton label="Volver a Admin" href="/dashboard/admin" variant="ghost" />
          <SafeActionButton label="Ver todos avances" href="/demo/showcase#phase4-hologram-landbank" variant="primary" />
          <SafeActionButton label="Investor (portfolio)" href="/dashboard/investor" variant="ghost" />
          <SafeActionButton label="Marketplace (PNC ties)" href="/dashboard/investor/marketplace" variant="ghost" />
          <Link href="#yields-surface" className="text-xs px-3 py-1.5 rounded bg-pn-surface border border-pn-border text-pn-gold/80">Yields surface</Link>
          <Link href="#gov-surface" className="text-xs px-3 py-1.5 rounded bg-pn-surface border border-pn-border text-pn-gold/80">Gov/Borrow surface</Link>
        </div>
      </div>

      <JourneyProgressRail journey={adminJourney} currentStepId="a1" />

      <NextStepCard 
        dataTestId="next-step-card-admin-landbank"
        contextLabel="Admin • Landbanking"
        title="PachaNova Landbanking — Admin Master Console (Full Unified @3000)"
        explanation="Consola 5PNC con flujos persistidos de lanzamiento, P2P, préstamo, renta, voto y atestación perpetua. Los valores ORQ mostrados son referencias del dataset demo; no representan liquidación externa ni una promesa de rendimiento."
        nextStep="Usa los hologramas y botones E2E; luego verifica cada evidencia en mercado, ledger, auditoría e integraciones."
        primaryAction={{ label: "Ver Showcase Holograms", href: "/demo/showcase#phase4-hologram-landbank", intent: "navigate" }}
        secondaryAction={{ label: "Panel Inversor", href: "/dashboard/investor", intent: "navigate" }}
        status="GO"
      />

      {/* Full landbank with all post-F6 enhancements visible */}
      <LandbankManagementClient />

      <div className="text-[9px] text-pn-text-soft border-t border-pn-border pt-3">
        PachaNova Landbanking full (entire PachaNova + all tools: Master 5PNC, P2P, credits, yields/flywheel, gov, orq high-level, autonomy, holograms). Single unified project. Permanent rich visuals. orq bridge high-level only (badges/notes). 
      </div>
    </div>
  );
}

export default function AdminLandbankPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando Landbank Admin (holograms E2E)..." />}>
      <AdminLandbankContent />
    </Suspense>
  );
}
