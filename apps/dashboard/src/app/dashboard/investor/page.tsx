export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { 
  InvestorPortfolioHero, 
  ProRataLandCardV2, 
  InvestorLedgerPanel, 
  InvestorKycStatusPanel, 
  GenesisDemoActionCard, 
  InvestorWalletStatusPanel,
  LandbankManagementClient,
  InvestorEnhancedToolsClient 
} from "@/components/product";
import { InvestorDashboardView } from "@/types/product";
import { Suspense } from "react";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { investorJourney } from "@/lib/navigation/userJourneys";

import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq } from "drizzle-orm";

async function fetchInvestorData(): Promise<InvestorDashboardView | null> {
  try {
    // 1. Fetch default holder investor from database
    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, "demo.investor.holder@pachanova.local")
    });

    if (!investor) {
      throw new Error("Default holder investor not found in database");
    }

    // 2. Fetch balance
    const balance = await db.query.balances.findFirst({
      where: eq(schema.balances.investorId, investor.id)
    });

    // 3. Fetch recent transactions
    const rawTxs = await db.query.transactions.findMany({
      where: eq(schema.transactions.senderId, investor.id),
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
      limit: 10
    });

    const recentTransactions: InvestorDashboardView["recentTransactions"] = rawTxs.map((tx) => {
      const operationType = tx.type === "transfer"
        ? "TRANSFER"
        : tx.type === "burn"
          ? "BURN"
          : tx.type === "mint"
            ? "MINT"
            : "GENESIS_PURCHASE";

      const status = tx.status === "completed"
        ? "confirmed"
        : tx.status === "failed"
          ? "failed"
          : "pending";

      return {
        id: tx.id,
        amount: tx.amount,
        operationType,
        txHash: tx.txHash,
        status,
        timestamp: tx.createdAt.toISOString(),
      };
    });

    return {
      investor: {
        id: investor.id,
        fullName: `${investor.firstName || ''} ${investor.lastName || ''}`.trim() || "Inversor Demo",
        email: investor.email,
        kycStatus: investor.kycStatus || "approved",
        isVerified: investor.isVerified || true,
        balance: {
          investorId: investor.id,
          availableTokens: balance?.availableTokens || "0",
          lockedTokens: balance?.lockedTokens || "0",
          availableUsd: balance?.availableUsd || "0",
          lockedUsd: "0",
          lastUpdated: balance?.lastUpdatedAt?.toISOString() || new Date().toISOString()
        }
      },
      recentTransactions,
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
    console.error("Error fetching investor view model from DB, using fallback:", error);
    return {
      investor: {
        id: "demo-investor-123",
        fullName: "Inversor Demo (Respaldo)",
        email: "investor@pachanova.local",
        kycStatus: "approved",
        isVerified: true,
        balance: {
          investorId: "demo-investor-123",
          availableTokens: "1250",
          lockedTokens: "0",
          availableUsd: "5000",
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
  }
}

async function InvestorDashboardContent() {
  const view = await fetchInvestorData();

  if (!view) {
    return <ErrorState title="Panel no disponible" message="No se pudo construir el ViewModel del inversor. Verifica PostgreSQL y ejecuta el reset determinista del entorno demo." />;
  }

  const availableTokensNum = Number(view.investor.balance.availableTokens);
  const lockedTokensNum = Number(view.investor.balance.lockedTokens);
  const availableUsdNum = Number(view.investor.balance.availableUsd);

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor" }
        ]} />
        <div className="flex flex-wrap gap-2">
          <SafeActionButton label="Ver todos los avances" href="/demo/showcase#phase4-hologram-landbank" variant="primary" />
          <SafeActionButton label="Hub Central" href="/demo/showcase" variant="ghost" />
          <SafeActionButton label="Identity/KYC" href="/demo/integrations" variant="ghost" />
          <SafeActionButton label="P2P Marketplace" href="/dashboard/investor/marketplace" variant="ghost" />
          <SafeActionButton label="Historial Genesis" href="/dashboard/investor/genesis" variant="ghost" />
          <SafeActionButton label="Disclaimers" href="/dashboard/investor/disclosures" variant="ghost" />
          <SafeActionButton label="Admin Landbank" href="/dashboard/admin/landbank" variant="ghost" />
        </div>
      </div>

      <JourneyProgressRail journey={investorJourney} currentStepId="i1" />

      <NextStepCard 
        dataTestId="next-step-card-investor"
        contextLabel="Panel Inversor"
        title="Tu Portafolio de Fracciones Inmobiliarias & RWA — PachaNova"
        explanation="Bienvenido a tu panel de co-propietario. Aquí puedes gestionar tus fracciones de tierra y desarrollos inmobiliarios en San Bartolo, solicitar créditos hipotecando tus tokens, reclamar dividendos de rentas mensuales, y transferir tus derechos en el mercado secundario P2P con custodia fiduciaria regulada."
        nextStep="Explora las herramientas avanzadas a continuación: descarga tu certificado oficial, solicita liquidez hipotecando tokens o participa en el mercado P2P."
        primaryAction={{ label: "Simular Compra Genesis", href: "/dashboard/investor/genesis", intent: "navigate" }}
        secondaryAction={{ label: "Ver Libro de Registro", href: "/dashboard/investor/ledger", intent: "navigate" }}
        status="GO"
      />

      <InvestorPortfolioHero view={view} />

      {/* Herramientas Avanzadas: Título SUNARP, Modelo Económico & Préstamos Colateralizados */}
      <InvestorEnhancedToolsClient
        availableTokens={availableTokensNum}
        lockedTokens={lockedTokensNum}
        availableUsd={availableUsdNum}
        investorEmail={view.investor.email}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <LandbankManagementClient />
          <InvestorLedgerPanel view={view} />
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
    <Suspense fallback={<LoadingState message="Cargando estado del inversor..." />}>
      <InvestorDashboardContent />
    </Suspense>
  );
}
