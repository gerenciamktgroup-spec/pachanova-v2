import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { 
  InvestorPortfolioHero, 
  ProRataLandCardV2, 
  InvestorLedgerPanel, 
  InvestorKycStatusPanel, 
  GenesisDemoActionCard, 
  InvestorWalletStatusPanel 
} from "@/components/product";
import { InvestorDashboardView } from "@/types/product";
import { Suspense } from "react";
import { PRODUCT_COPY } from "@/lib/copy/productCopy";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { investorJourney } from "@/lib/navigation/userJourneys";

async function fetchInvestorData(): Promise<InvestorDashboardView | null> {
  try {
    return {
      investor: {
        id: "demo-investor-123",
        fullName: "Inversor Demo",
        email: "investor@pachanova.local",
        kycStatus: "pending",
        isVerified: false,
        balance: {
          investorId: "demo-investor-123",
          availableTokens: "5000",
          lockedTokens: "0",
          availableUsd: "42000",
          lockedUsd: "0",
          lastUpdated: new Date().toISOString()
        }
      },
      recentTransactions: [],
      kycVerificationProvider: "SIMULATED",
      paymentsReadiness: {
        provider: "MERCADOPAGO",
        status: "PENDING_CREDENTIALS",
        lastPing: null,
        message: "No credentials"
      },
      contractReadiness: {
        provider: "FOUNDRY",
        status: "PENDING_FOUNDRY",
        lastPing: null,
        message: "Node inactive"
      }
    };
  } catch (error) {
    console.error("Error fetching investor view model:", error);
    return null;
  }
}

async function InvestorDashboardContent() {
  const view = await fetchInvestorData();

  if (!view) {
    return <ErrorState title="Error de Simulación" message="No se pudo construir el ViewModel del inversor." />;
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
        title="Tu Portafolio RWA Simulado"
        explanation="Estás viendo tu posición demo sobre el activo San Bartolo. Tu saldo actual y las métricas provienen de una base de datos local y no representan valor financiero real."
        nextStep="Puedes revisar el Ledger PACHA para auditar tu saldo o simular el flujo Genesis de compra."
        primaryAction={{ label: "Simular Flujo Genesis", href: "/dashboard/investor/genesis", intent: "navigate" }}
        secondaryAction={{ label: "Revisar Ledger", href: "/dashboard/investor/ledger", intent: "navigate" }}
        status="GO"
      />

      <InvestorPortfolioHero view={view} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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
