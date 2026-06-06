import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { 
  InvestorPortfolioHero, 
  ProRataLandCardV2, 
  InvestorLedgerPanel, 
  InvestorKycStatusPanel, 
  GenesisDemoActionCard, 
  InvestorWalletStatusPanel,
  LandbankManagementClient 
} from "@/components/product";
import { InvestorDashboardView } from "@/types/product";
import { Suspense } from "react";
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
    return <ErrorState title="Error (PachaNova Landbanking Full Unified Rich Demo)" message="No se pudo construir el ViewModel del inversor. DATOS REALES. Master sacred. See /admin/landbank for full holograms." />;
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor" }
        ]} />
        <div className="flex flex-wrap gap-2">
          {/* Fase 6: Ver todos los avances immediate + full hub/identity cross-links */}
          <SafeActionButton label="Ver todos los avances" href="/demo/showcase#phase4-hologram-landbank" variant="primary" />
          <SafeActionButton label="Ver avances (Yields/Gov/Borrow E2E)" href="/demo/showcase#phase4-hologram-landbank" variant="ghost" />
          <SafeActionButton label="Hub Central" href="/demo/showcase" variant="ghost" />
          <SafeActionButton label="Identity/KYC" href="/demo/integrations" variant="ghost" />
          <SafeActionButton label="P2P Marketplace (5PNC ties)" href="/dashboard/investor/marketplace" variant="ghost" />
          <SafeActionButton label="Historial Genesis" href="/dashboard/investor/genesis" variant="ghost" />
          <SafeActionButton label="Disclaimers" href="/dashboard/investor/disclosures" variant="ghost" />
          <SafeActionButton label="Integraciones" href="/demo/integrations" variant="ghost" />
          <SafeActionButton label="Admin Landbank" href="/dashboard/admin/landbank" variant="ghost" />
        </div>
      </div>

      <JourneyProgressRail journey={investorJourney} currentStepId="i1" />

      <NextStepCard 
        dataTestId="next-step-card-investor"
        contextLabel="Panel Inversor"
        title="Tu Portafolio RWA Simulado • PachaNova Landbanking Full Unified"
        explanation="Estás viendo tu posición demo sobre el activo San Bartolo + full 5PNC Landbank holograms. Tu saldo actual y las métricas provienen de una base de datos local y no representan valor financiero real. Rich permanent demo. DATOS REALES. Master sacred. Post-F6: live orq high-level bridge (exercised badges + Fase cycle notes F16/21/36/47/51/53) visible in holograms/landbank/portfolio. Fase 6 + continuation: E2E flows live in Landbank client (Master→P2P 5PNC→Borrow→Claim→Gov)."
        nextStep="Usa el Landbank Hologram para E2E completo (launch/P2P/borrow/claim/vote). Revisa Ledger o Genesis. Ver yields/gov/borrow expansions."
        primaryAction={{ label: "Simular Flujo Genesis", href: "/dashboard/investor/genesis", intent: "navigate" }}
        secondaryAction={{ label: "Revisar Ledger", href: "/dashboard/investor/ledger", intent: "navigate" }}
        status="GO"
      />

      <InvestorPortfolioHero view={view} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Fase 6 Polish: Full Hologram Landbank client (5 PNC interactive E2E flows + P2P ties + borrow/claim/gov + identity/hub everywhere) - Phase 4 visuals base */}
          <LandbankManagementClient />
          <InvestorLedgerPanel view={view} />
          {/* Legacy simple pro-rata kept for reference (below) */}
          <ProRataLandCardV2 view={view} />
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
