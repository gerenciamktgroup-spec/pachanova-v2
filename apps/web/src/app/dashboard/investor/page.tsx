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

import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function fetchInvestorData(): Promise<InvestorDashboardView | null> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // 1. Investor
    const { data: investor, error: investorError } = await supabase
      .from("investors")
      .select("*")
      .eq("supabase_auth_id", user.id)
      .single();

    if (investorError || !investor) {
      console.error("Investor not found in DB:", investorError);
      return null; // The page will render an ErrorState
    }

    // 2. Balance
    const { data: balance } = await supabase
      .from("balances")
      .select("*")
      .eq("investor_id", investor.id)
      .single();

    // 3. Transactions
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // 4. Token Ledger (using transactions as proxy for ledger view for now)
    const { data: tokenLedger } = await supabase
      .from("token_ledger")
      .select("*")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // 5. KYC (check kyc_documents, fallback to investor status)
    const { data: kycDocs } = await supabase
      .from("kyc_documents")
      .select("status")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const kycStatus = kycDocs && kycDocs.length > 0 ? kycDocs[0].status : (investor.kyc_status || "pending");

    // We coalesce token_ledger entries, or transactions if token_ledger is empty, mapping to LedgerEntryView
    const rawTxs = (tokenLedger && tokenLedger.length > 0) ? tokenLedger : (transactions || []);

    return {
      investor: {
        id: investor.id,
        fullName: `${investor.first_name} ${investor.last_name}`.trim(),
        email: investor.email,
        kycStatus: kycStatus as "pending" | "approved" | "rejected",
        isVerified: investor.is_verified || false,
        balance: {
          investorId: investor.id,
          availableTokens: balance?.available_tokens?.toString() || "0",
          lockedTokens: balance?.locked_tokens?.toString() || "0",
          availableUsd: balance?.available_usd?.toString() || "0",
          lockedUsd: balance?.locked_usd?.toString() || "0",
          lastUpdated: balance?.last_updated_at || new Date().toISOString()
        }
      },
      recentTransactions: rawTxs.map((tx: any) => ({
        id: tx.id,
        operationType: tx.operation_type || tx.type || "TRANSFER",
        amount: tx.amount?.toString() || "0",
        timestamp: tx.created_at,
        txHash: tx.tx_hash || null,
        status: tx.status || "confirmed"
      })),
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
