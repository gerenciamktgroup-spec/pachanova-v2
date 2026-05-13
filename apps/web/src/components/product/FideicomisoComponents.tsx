"use client";

import React, { useState } from "react";
import { MissionCard } from "@/components/mission/MissionCard";
import { IntegrationStatusBadge } from "@/components/mission/IntegrationStatusBadge";
import { CommandButton } from "@/components/mission/CommandButton";
import { TimelineRail, TimelineItem } from "@/components/mission/TimelineRail";
import { ProductEmptyState } from "./SharedComponents";
import { FideicomisoDashboardView } from "@/types/product";
import { Shield, FileText, CheckCircle2, Lock } from "lucide-react";
import { PRODUCT_COPY } from "@/lib/copy/productCopy";

export function FideicomisoHero({ view }: { view: FideicomisoDashboardView }) {
  return (
    <MissionCard className="bg-gradient-to-br from-pn-surface to-pn-surface-strong border-pn-gold/20" animated>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-light tracking-tighter text-pn-text">
              Fideicomiso <span className="font-semibold text-pn-gold">Demo</span>
            </h1>
            <Shield className="w-6 h-6 text-pn-gold" />
          </div>
          <p className="text-sm text-pn-text-muted max-w-xl">
            {PRODUCT_COPY.disclaimers.noRealMoney} Las operaciones multi-firma están habilitadas visualmente pero no generan impacto on-chain.
          </p>
        </div>
        <IntegrationStatusBadge status={view.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-pn-border/50 pt-6">
        <div>
          <p className="text-xs text-pn-text-soft uppercase tracking-wider mb-1">Trust Anchor (Simulated)</p>
          <span className="text-pn-text font-mono text-sm">{view.trustAnchorHash || "PENDING FOUNDRY"}</span>
        </div>
        <div>
          <p className="text-xs text-pn-text-soft uppercase tracking-wider mb-1">Fiduciario Wallet</p>
          <span className="text-pn-text font-mono text-sm">{view.fiduciarioWallet || "0xDEMO...0000"}</span>
        </div>
        <div>
          <p className="text-xs text-pn-text-soft uppercase tracking-wider mb-1">Quorum Requerido</p>
          <span className="text-pn-text font-medium">{view.quorumRequired}/3 Firmas</span>
        </div>
      </div>
    </MissionCard>
  );
}

export function LegalBackingCard() {
  return (
    <MissionCard title="Respaldo Legal (Demo)" data-testid="legal-backing-card">
      <div className="p-4 bg-pn-surface-strong rounded border border-pn-border space-y-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-pn-text-muted mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-pn-text">Activo Subyacente: San Bartolo</h4>
            <p className="text-xs text-pn-text-soft mt-1">
              La plataforma asume una capa 0 con un activo físico de 5 hectáreas (50,000 m²). 
              El total supply de PACHA está fijado en 500,000 tokens (Regla: 1 PACHA = 0.1 m²).
            </p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[10px] text-pn-text-muted uppercase tracking-wider text-center">
        No Production Claims. Documentación jurídica no vinculante en este entorno.
      </p>
    </MissionCard>
  );
}

export function MultiSigOperationPanelV2({ view }: { view: FideicomisoDashboardView }) {
  const latestOp = view.pendingOperations[0]; // For demo purposes, taking the first one.

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleAction = async (action: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/demo/actions/fideicomiso-operation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action, 
          operationId: latestOp?.id || "00000000-0000-0000-0000-000000000001", // fallback for demo if none exists
          userId: "00000000-0000-0000-0000-000000000000" 
        }),
      });
      const data = await res.json();
      setResult(data);
      // In a real app we'd refresh the server component or use a router.refresh() here.
      // For this demo mirror, showing the success result inline is acceptable.
    } catch {
      setResult({ ok: false, message: "Error de red local" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MissionCard title="Operaciones Multi-Firma" data-testid="fideicomiso-quorum-card">
      {!latestOp && !result ? (
        <div className="space-y-4">
          <ProductEmptyState 
            title="Sin operaciones pendientes" 
            description="El contrato del fideicomiso no tiene acciones esperando firma." 
          />
          <CommandButton variant="outline" fullWidth onClick={() => handleAction("propose")} disabled={isSubmitting} data-testid="fideicomiso-propose-action">
            {isSubmitting ? "Proponiendo..." : "Proponer Operación Demo"}
          </CommandButton>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold px-2 py-1 bg-pn-surface-strong rounded border border-pn-border mb-2 inline-block">
                {latestOp?.type || "DEMO_EMISSION"}
              </span>
              <p className="text-sm text-pn-text">{latestOp?.description || "Emisión simulada de tokens"}</p>
            </div>
            <IntegrationStatusBadge status={latestOp?.status === "pending" || !latestOp ? "SIMULATED" : "CONNECTED"} />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-pn-text-soft uppercase">Progreso de Firmas</p>
            <div className="flex gap-2">
              {[1, 2, 3].map(num => (
                <div 
                  key={num} 
                  className={`flex-1 h-2 rounded ${num <= (latestOp?.currentSignatures || 0) ? 'bg-pn-gold' : 'bg-pn-surface-strong border border-pn-border'}`}
                />
              ))}
            </div>
            <p className="text-xs text-pn-text-muted text-right">{latestOp?.currentSignatures || 0} de {latestOp?.requiredSignatures || 3} requeridas</p>
          </div>

          {result && (
            <div className={`p-4 rounded-lg border flex gap-3 ${result.ok ? "text-pn-success border-pn-success/30 bg-pn-success/10" : "text-pn-danger border-pn-danger/30 bg-pn-danger/10"}`}>
              <div>
                <h4 className="text-sm font-semibold mb-1">{result.ok ? "Operación Registrada" : "Error"}</h4>
                <p className="text-xs opacity-90">{result.message}</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-pn-border grid grid-cols-2 gap-3">
            <CommandButton 
              variant="outline" 
              icon={<Lock className="w-4 h-4"/>} 
              disabled={isSubmitting || (latestOp?.currentSignatures || 0) >= 1}
              onClick={() => handleAction("sign_fiduciario")}
              data-testid="fideicomiso-sign-fiduciario-action"
            >
              Firmar Fiduciario
            </CommandButton>
            <CommandButton 
              variant="outline" 
              disabled={isSubmitting || (latestOp?.currentSignatures || 0) < 1}
              onClick={() => handleAction("sign_admin")}
              data-testid="fideicomiso-sign-admin-action"
            >
              Firmar Admin
            </CommandButton>
          </div>
          
          <CommandButton 
            variant="primary" 
            fullWidth 
            disabled={isSubmitting || (latestOp?.currentSignatures || 0) < 2}
            onClick={() => handleAction("execute_simulated")}
            data-testid="fideicomiso-execute-action"
          >
            Ejecutar Simulación
          </CommandButton>

          <p className="text-[10px] text-pn-warning text-center mt-2">
            Pending Foundry: Ejecución afectará solo al Sandbox DB.
          </p>
        </div>
      )}
    </MissionCard>
  );
}

export function TrustAnchorTimeline({ view }: { view: FideicomisoDashboardView }) {
  const items: TimelineItem[] = view.recentHistory.map(log => ({
    id: log.id,
    title: log.action,
    description: <span className="text-pn-text-muted">{log.details}</span>,
    status: "completed",
    time: new Date(log.timestamp).toLocaleString(),
    icon: <CheckCircle2 className="h-4 w-4 text-pn-success" />
  }));

  return (
    <MissionCard title="Historial del Contrato" data-testid="trust-anchor-timeline">
      {items.length === 0 ? (
        <ProductEmptyState title="Sin historial" description="El contrato aún no ha registrado eventos." />
      ) : (
        <TimelineRail items={items} />
      )}
    </MissionCard>
  );
}
