export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs } from "@/components/mission/RouteBreadcrumbs";
import { ErrorState, LoadingState } from "@/components/mission/StateComponents";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { 
  InvestorPortfolioHero, 
  ProRataLandCardV2, 
  InvestorLedgerPanel, 
  InvestorKycStatusPanel, 
  GenesisDemoActionCard, 
  InvestorWalletStatusPanel,
  ROICalculator
} from "@/components/product";
import { InvestorDashboardView } from "@/types/product";
import { Suspense } from "react";
import { PRODUCT_COPY } from "@/lib/copy/productCopy";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { investorJourney } from "@/lib/navigation/userJourneys";

import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchInvestorData } from "@/lib/data/fetchInvestorData";



async function InvestorDashboardContent() {
  const view = await fetchInvestorData();

  if (!view) {
    return <ErrorState title="Error de carga" message="No pudimos cargar tu portafolio. Verificá tu identidad antes de operar. Son 5 minutos →" />;
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor" }
        ]} />
        <div className="flex flex-wrap gap-2">
          <SafeActionButton label="Historial Genesis" href="/dashboard/investor/genesis" variant="ghost" />
          <SafeActionButton label="Disclaimers" href="/dashboard/investor/disclosures" variant="ghost" />
          <SafeActionButton label="Integraciones" href="/demo/integrations" variant="ghost" />
        </div>
      </div>

      <JourneyProgressRail journey={investorJourney} currentStepId="i1" />

      <NextStepCard 
        dataTestId="next-step-card-investor"
        contextLabel="Panel Inversor"
        title="Tu portafolio de inversión"
        explanation="Acá ves tus Fracciones (PACHA) que representan tu participación en la propiedad, la plusvalía estimada, y tus órdenes P2P activas."
        nextStep="Explorá la ronda Genesis para comprar fracciones o usa la Calculadora de ROI para proyectar ganancias."
        primaryAction={{ label: "Comprar Fracciones", href: "/dashboard/investor/genesis", intent: "navigate" }}
        secondaryAction={{ label: "Liquidar Posición", href: "#", intent: "none" }} // Placeholder for Phase 3 Liquidar concept
        status="GO"
      />

      <InvestorPortfolioHero view={view} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ROICalculator />
          <ProRataLandCardV2 view={view} />
          <InvestorLedgerPanel view={view} />
        </div>
        
        <div className="space-y-8">
          <GenesisDemoActionCard view={view} />
          <InvestorKycStatusPanel view={view} />
          <InvestorWalletStatusPanel view={view} />
        </div>
      </div>
    </div>
  );
}

export default function InvestorDashboardPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando estado del inversor simulado..." />}>
      <InvestorDashboardContent />
    </Suspense>
  );
}
