export const dynamic = 'force-dynamic';

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

import { schema } from "@pachanova/database";
import { eq, desc, like } from "drizzle-orm";
import { FideicomisoOperationView } from "@/types/product";

async function fetchFideicomisoData(): Promise<FideicomisoDashboardView | null> {
  try {
    const ops = await db.query.fideicomisoOperations.findMany({
      orderBy: [desc(schema.fideicomisoOperations.id)],
      limit: 10
    });

    const pendingOperations: FideicomisoOperationView[] = [];

    for (const op of ops) {
      const signatures = await db.query.fideicomisoSignatures.findMany({
        where: eq(schema.fideicomisoSignatures.operationId, op.id)
      });

      let mappedStatus: "pending" | "signed" | "executed" | "rejected" = "pending";
      if (op.status === "executed_simulated" || op.status === "executed") mappedStatus = "executed";
      else if (op.status === "fiduciario_signed" || op.status === "quorum_reached") mappedStatus = "signed";
      else if (op.status === "rejected") mappedStatus = "rejected";

      const description = op.type === "DEMO_EMISSION" || op.type === "EMISION_DEMO"
        ? `Autorizar emisión de ${op.tokenAmount ? parseFloat(op.tokenAmount).toLocaleString() : '500,000'} PACHA simulados para el Sandbox.`
        : `Operación fiduciaria de tipo ${op.type} por ${op.tokenAmount ? parseFloat(op.tokenAmount).toLocaleString() : '0'} tokens.`;

      pendingOperations.push({
        id: op.id,
        type: op.type,
        description,
        status: mappedStatus,
        requiredSignatures: op.requiredSignatures,
        currentSignatures: op.currentSignatures,
        signatures: signatures.map(s => ({
          signerRole: s.signerRole.toUpperCase(),
          signedAt: s.timestamp.toISOString()
        })),
        createdAt: op.executedAt ? op.executedAt.toISOString() : new Date().toISOString()
      });
    }

    // Fetch real audit logs for timeline
    const dbLogs = await db.query.auditLogs.findMany({
      where: like(schema.auditLogs.action, "FIDEICOMISO_%"),
      orderBy: [desc(schema.auditLogs.timestamp)],
      limit: 10
    });

    const recentHistory = dbLogs.map(log => ({
      id: log.id,
      action: log.action.replace("FIDEICOMISO_", "").replace("_", " "),
      details: log.details,
      timestamp: log.timestamp.toISOString(),
      actor: log.userId ? `User:${log.userId}` : "System"
    }));

    if (recentHistory.length === 0) {
      recentHistory.push({
        id: "log-initial",
        action: "Trust Anchor Initialization",
        details: "El smart contract del fideicomiso ha sido inicializado en el entorno local (Sandbox).",
        timestamp: new Date().toISOString(),
        actor: "System"
      });
    }

    return {
      status: "SIMULATED",
      trustAnchorHash: ops[0]?.sunarpHash || null,
      quorumRequired: 3,
      fiduciarioWallet: ops[0]?.notarioHash || null,
      pendingOperations,
      recentHistory
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

      {/* Fase142: Recibos Digitales Fideicomiso (post-compra from invest checkout) - real DB */}
      <div className="p-4 border border-emerald-600/30 bg-emerald-900/10 rounded-xl">
        <div className="text-emerald-400 text-xs uppercase tracking-widest mb-2">RECIBOS FIDEICOMISO DIGITALES EMITIDOS (post-compra)</div>
        {(await db.query.fideicomisoAudits.findMany({ where: eq(schema.fideicomisoAudits.documentType, "RECIBO_COMPRA"), orderBy: (t, { desc }) => [desc(t.createdAt)], limit: 5 })).length > 0 ? (
          <div className="space-y-2">
            {(await db.query.fideicomisoAudits.findMany({ where: eq(schema.fideicomisoAudits.documentType, "RECIBO_COMPRA"), orderBy: (t, { desc }) => [desc(t.createdAt)], limit: 5 })).map((r: any) => {
              let meta: any = {};
              try { meta = JSON.parse(r.metadata || '{}'); } catch (_) {}
              return (
                <div key={r.id} className="p-2 border border-emerald-700/30 rounded text-xs font-mono text-white/90">
                  {r.arweaveTxId || 'FID-NONE'} • {meta.note || `Compra de tokens`} • {meta.status || 'completed'}
                </div>
              );
            })}
          </div>
        ) : <div className="text-xs text-white/50">No hay recibos aún. Realiza una compra en /invest/[id] para emitir.</div>}
        <div className="text-[9px] text-white/50 mt-1">Datos reales de DB (fideicomiso_audits). Smart-contract hash incluido en detalles.</div>
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
