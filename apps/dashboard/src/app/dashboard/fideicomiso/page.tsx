import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { 
  FideicomisoHero, 
  LegalBackingCard, 
  MultiSigOperationPanelV2, 
  TrustAnchorTimeline 
} from "@/components/product";
import { FideicomisoDashboardView } from "@/types/product";
import { Suspense } from "react";
import { NextStepCard } from "@/components/product/NextStepCard";
import { JourneyProgressRail } from "@/components/product/JourneyProgressRail";
import { fiduciarioJourney } from "@/lib/navigation/userJourneys";
import { db } from "@/server/db";
import { requireRole } from "@/utils/auth/requireRole";

async function fetchFideicomisoData(): Promise<FideicomisoDashboardView | null> {
  try {
    const ops = await db.query.fideicomisoOperations.findMany({
      limit: 1
    });
    const latestOp = ops[0];
    const opId = latestOp?.id || "00000000-0000-0000-0000-000000000001";
    const status = latestOp?.status;
    let mappedStatus: "pending" | "rejected" | "signed" | "executed" = "pending";
    if (status === "executed_simulated") mappedStatus = "executed";
    else if (status === "fiduciario_signed" || status === "quorum_reached") mappedStatus = "signed";
    else mappedStatus = "pending";

    // Simulate fetching fideicomiso state
    return {
      status: "SIMULATED",
      trustAnchorHash: null,
      quorumRequired: 3,
      fiduciarioWallet: null,
      pendingOperations: [
        {
          id: opId,
          type: "EMISION_DEMO",
          description: "Autorizar emisión de 500,000 PACHA simulados para el Sandbox.",
          status: mappedStatus,
          requiredSignatures: 3,
          currentSignatures: latestOp?.currentSignatures || 0,
          signatures: [
            { signerRole: "ADMIN", signedAt: new Date().toISOString() }
          ],
          createdAt: new Date().toISOString()
        }
      ],
      recentHistory: [
        {
          id: "log-1",
          action: "Trust Anchor Initialization",
          details: "El smart contract del fideicomiso ha sido inicializado en el entorno local (Sandbox).",
          timestamp: new Date().toISOString(),
          actor: "System"
        }
      ]
    };
  } catch (error) {
    console.error("Error fetching fideicomiso view model:", error);
    return null;
  }
}

async function FideicomisoDashboardContent() {
  await requireRole(["admin", "fiduciario", "fideicomiso"]);
  const view = await fetchFideicomisoData();

  if (!view) {
    return <ErrorState title="Error de Simulación" message="No se pudo construir el ViewModel del Fideicomiso." />;
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Fideicomiso" }
        ]} />
        <div className="flex flex-wrap gap-2">
          <SafeActionButton label="Operaciones" href="/dashboard/fideicomiso/operations" variant="ghost" />
          <SafeActionButton label="Firmas" href="/dashboard/fideicomiso/signatures" variant="ghost" />
          <SafeActionButton label="Respaldo Legal" href="/dashboard/fideicomiso/legal-backing" variant="ghost" />
        </div>
      </div>

      <JourneyProgressRail journey={fiduciarioJourney} currentStepId="f1" />

      <NextStepCard 
        dataTestId="next-step-card-fideicomiso"
        contextLabel="Fideicomiso"
        title="Panel Multi-Sig Simulado"
        explanation="Estás en el módulo fiduciario demo. Aquí puedes revisar el respaldo legal RWA de San Bartolo y simular una autorización de emisión de tokens mediante un quórum 2/3."
        nextStep="Puedes revisar el respaldo legal o proceder a las operaciones pendientes para firmar."
        primaryAction={{ label: "Ver Operaciones", href: "/dashboard/fideicomiso/operations", intent: "navigate" }}
        secondaryAction={{ label: "Respaldo Legal", href: "/dashboard/fideicomiso/legal-backing", intent: "navigate" }}
        status="GO"
      />
      <FideicomisoHero view={view} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <LegalBackingCard />
          <MultiSigOperationPanelV2 view={view} />
        </div>
        
        <div className="space-y-8">
          <TrustAnchorTimeline view={view} />
        </div>
      </div>
    </div>
  );
}

export default function FideicomisoDashboardPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando estado legal simulado..." />}>
      <FideicomisoDashboardContent />
    </Suspense>
  );
}
