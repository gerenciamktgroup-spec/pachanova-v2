export const dynamic = 'force-dynamic';

import { RouteBreadcrumbs } from "@/components/mission/RouteBreadcrumbs";
import { ErrorState, LoadingState } from "@/components/mission/StateComponents";
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
// import removed

async function fetchFideicomisoData(): Promise<FideicomisoDashboardView | null> {
  try {
    // Return static mock state to bypass Drizzle ECONNREFUSED crash
    return {
      status: "SIMULATED",
      trustAnchorHash: null,
      quorumRequired: 3,
      fiduciarioWallet: null,
      pendingOperations: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          type: "EMISION_DEMO",
          description: "Autorizar emisión de 500,000 PACHA simulados para el Sandbox.",
          status: "pending",
          requiredSignatures: 3,
          currentSignatures: 0,
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
  const view = await fetchFideicomisoData();

  if (!view) {
    return <ErrorState title="Error de carga" message="No se pudo cargar el panel del fideicomiso." />;
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
        title="Panel fiduciario"
        explanation="Las operaciones pendientes esperan tu firma. Sin quórum 2/3 no se procesan. El quórum actual muestra cuántos fideicomisarios firmaron (se necesitan 2 de 3 para ejecutar)."
        nextStep="Revisá el respaldo legal o procedé a las operaciones pendientes para firmar."
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
