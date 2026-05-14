"use client";

import { RouteBreadcrumbs, SectionHeader, MissionCard, CommandButton, IntegrationStatusBadge } from "@/components/mission";
import { WorkflowStepper, TransactionReviewPanel, WorkflowResultNotice } from "@/components/product/ActionComponents";
import { TokenMathExplainer, GenesisExplainer } from "@/components/public/ExplainerComponents";
import { useState } from "react";
import Link from "next/link";
import { UserStatusPill } from "@/components/product/SharedComponents";
import { useRouter } from "next/navigation";

interface GenesisClientProps {
  kycStatus: "approved" | "pending" | "rejected";
  availableUsd: number;
  investorId: string;
  propertyId: string;
}

export function InvestorGenesisClient({ kycStatus, availableUsd, investorId, propertyId }: GenesisClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [quantity, setQuantity] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; status?: string } | null>(null);

  const PRICE_PER_PACHA = 8.40;
  const totalCost = quantity * PRICE_PER_PACHA;
  const hasEnoughFunds = availableUsd >= totalCost;

  const handleSimulate = async () => {
    if (!hasEnoughFunds) {
      setResult({ ok: false, message: "Fondos USD insuficientes para esta operación." });
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/demo/actions/genesis-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          investorId, 
          propertyId,
          quantity,
          unitPrice: PRICE_PER_PACHA
        }), 
      });
      const data = await res.json();
      setResult({ ok: data.success, message: data.success ? `Orden registrada. Nuevo balance: ${data.newBalance} PACHA` : data.error });
      setCurrentStep(3); // Move to final results step
      if (data.success) {
        router.refresh(); // Refresh server data
      }
    } catch {
      setResult({ ok: false, message: "Error de red local" });
      setCurrentStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const steps = ["Identidad", "Tokens a Simular", "Review & Pago", "Evidencia Sandbox"];

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="genesis-flow-page">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor", href: "/dashboard/investor" },
          { label: "Simulación Genesis" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Marketplace Demo"
          title="Simulación Flujo Genesis"
          description="Este flujo educativo te guiará paso a paso sobre cómo funcionará la adquisición de tokens en la plataforma."
        />
      </div>

      <WorkflowStepper steps={steps} currentStep={currentStep} />

      {/* Step 0: Identidad */}
      {currentStep === 0 && (
        <MissionCard title="Paso 1: Verificación de Identidad (KYC)" variant="elevated" className="genesis-step-profile" data-testid="genesis-step-profile">
          <div className="space-y-4">
            <p className="text-sm text-pn-text-muted">
              Antes de participar en la fase Genesis, la regulación exige una validación de identidad estricta. En este Sandbox, tu cuenta refleja su estado real en DB.
            </p>
            <div className="flex justify-between items-center p-4 border border-pn-border bg-pn-surface-strong rounded-lg">
              <span className="text-sm">Estado de tu cuenta Demo:</span>
              <UserStatusPill status={kycStatus} />
            </div>
            {kycStatus !== "approved" ? (
              <WorkflowResultNotice type="error" title="Identidad Pendiente" message="No puedes continuar sin validación." />
            ) : (
              <div className="flex justify-end pt-4">
                <CommandButton variant="primary" onClick={nextStep}>Continuar al Selector</CommandButton>
              </div>
            )}
          </div>
        </MissionCard>
      )}

      {/* Step 1: Selección Matemática */}
      {currentStep === 1 && (
        <MissionCard title="Paso 2: Selección de Cantidad Demo" variant="elevated" data-testid="genesis-step-quantity">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-pn-text mb-2">Cantidad de PACHA a Simular</label>
              <input 
                type="number" 
                min={1} 
                max={50000} 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-pn-bg border border-pn-border rounded-md px-4 py-2 text-pn-text focus:outline-none focus:border-pn-gold"
              />
              <p className="text-xs text-pn-text-muted mt-2">Prueba ingresando distintos valores para entender la conversión.</p>
            </div>
            
            <TokenMathExplainer quantity={quantity} />

            <div className="flex justify-between pt-4">
              <CommandButton variant="outline" onClick={prevStep}>Atrás</CommandButton>
              <CommandButton variant="primary" onClick={nextStep}>Revisar Operación</CommandButton>
            </div>
          </div>
        </MissionCard>
      )}

      {/* Step 2: Revisión */}
      {currentStep === 2 && (
        <div className="space-y-6" data-testid="genesis-step-review">
          <GenesisExplainer />
          
          <MissionCard title="Paso 3: Checkout Simulado" variant="elevated">
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-pn-surface p-4 rounded-lg border border-pn-border">
                <span className="text-sm font-medium text-pn-text">Balance Disponible USD</span>
                <span className={`text-lg font-mono ${hasEnoughFunds ? 'text-pn-success' : 'text-pn-danger'}`}>
                  ${availableUsd.toFixed(2)}
                </span>
              </div>
              
              <TransactionReviewPanel 
                items={[
                  { label: "Cantidad PACHA", value: quantity },
                  { label: "Precio Unitario (USD)", value: `$${PRICE_PER_PACHA.toFixed(2)}` },
                  { label: "Equivalencia m²", value: `${(quantity * 0.1).toFixed(2)} m²` },
                  { label: "Pasarela de Pagos", value: <IntegrationStatusBadge status="PENDING_CREDENTIALS" dataTestId="genesis-pending-credentials" /> },
                ]}
                totalLabel="Costo Simulado Total"
                totalValue={`$${totalCost.toFixed(2)}`}
              />

              {!hasEnoughFunds && (
                 <WorkflowResultNotice type="error" title="Fondos Insuficientes" message="Para adquirir estos tokens, simula un depósito primero en tu Panel Inversor." />
              )}

              <p className="text-xs text-pn-warning text-center">
                Al confirmar, el sistema registrará la intención en la base de datos local, descontará tu balance y emitirá logs de auditoría simulando la conexión a MercadoPago.
              </p>

              <div className="flex justify-between pt-4 border-t border-pn-border">
                <CommandButton variant="outline" onClick={prevStep}>Atrás</CommandButton>
                <div data-testid="genesis-demo-submit">
                  <CommandButton variant="primary" onClick={handleSimulate} disabled={isSubmitting || !hasEnoughFunds}>
                    {isSubmitting ? "Procesando..." : "Registrar Intento Demo"}
                  </CommandButton>
                </div>
              </div>
            </div>
          </MissionCard>
        </div>
      )}

      {/* Step 3: Evidencia Sandbox */}
      {currentStep === 3 && result && (
        <MissionCard title="Paso 4: Trazabilidad Sandbox" variant="elevated" data-testid="genesis-step-demo-log">
          <div className="space-y-6">
            <div data-testid="genesis-demo-success">
              <WorkflowResultNotice 
                type={result.ok ? "success" : "error"} 
                title={result.ok ? "Orden Registrada Exitosamente" : "Error en Simulación"} 
                message={result.message} 
              />
            </div>
            
            {result.ok && (
              <div className="space-y-4">
                <p className="text-sm text-pn-text-muted">
                  ¿Qué acaba de ocurrir? En lugar de llamar a una API de cobros externa, el sistema aisló la solicitud y generó evidencia criptográfica local:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-pn-surface border border-pn-border rounded-lg">
                    <h5 className="font-medium text-sm text-pn-text mb-1">1. Registro de Adquisición</h5>
                    <p className="text-xs text-pn-text-muted mb-3">Tu compra descontó USD virtuales y te acreditó tokens PACHA en el ledger.</p>
                    <Link href="/dashboard/investor/ledger" className="text-xs text-pn-blue hover:underline">Ver Ledger →</Link>
                  </div>
                  <div className="p-4 bg-pn-surface border border-pn-border rounded-lg">
                    <h5 className="font-medium text-sm text-pn-text mb-1">2. Evento de Integración</h5>
                    <p className="text-xs text-pn-text-muted mb-3">Se generaron logs auditables de tu compra simulada localmente.</p>
                    <Link href="/demo/integrations" className="text-xs text-pn-blue hover:underline">Ver Integraciones →</Link>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-4 flex justify-end gap-3">
              <Link href="/dashboard/investor"><CommandButton variant="primary">Ver mi Portfolio</CommandButton></Link>
              <CommandButton variant="ghost" onClick={() => { setCurrentStep(1); setResult(null); }}>Simular de Nuevo</CommandButton>
            </div>
          </div>
        </MissionCard>
      )}

    </div>
  );
}
