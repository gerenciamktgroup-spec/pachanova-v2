"use client";

import { useState } from "react";
import { RouteBreadcrumbs, SectionHeader, MissionCard, CommandButton, IntegrationStatusBadge } from "@/components/mission";
import { WorkflowStepper, TransactionReviewPanel, WorkflowResultNotice } from "@/components/product/ActionComponents";
import { TokenMathExplainer, GenesisExplainer } from "@/components/public/ExplainerComponents";
import { UserStatusPill } from "@/components/product/SharedComponents";
import { buyTokensAction } from "./actions";
import Link from "next/link";

export default function InvestClient({ property, kycStatus }: { property: any, kycStatus: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [quantity, setQuantity] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const PRICE_PER_PACHA = Number(property.tokenPriceUsd);

  const handleSimulate = async () => {
    setIsSubmitting(true);
    try {
      const res = await buyTokensAction(property.id, quantity);
      setResult({ ok: res.success, message: res.success ? res.message : res.error || "Error" });
      setCurrentStep(3);
    } catch (e) {
      setResult({ ok: false, message: "Error de red local" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const steps = ["Identidad", "Cantidad", "Checkout", "Recibo"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor", href: "/dashboard/investor" },
          { label: "Invertir en " + property.name }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Marketplace RWA"
          title={`Adquisición: ${property.name}`}
          description={`Flujo de tokenización para ${property.location}. Simulando conexión a oráculos y pasarelas locales.`}
        />
      </div>

      <WorkflowStepper steps={steps} currentStep={currentStep} />

      {/* Step 0: Identidad */}
      {currentStep === 0 && (
        <MissionCard title="Paso 1: Verificación de Identidad (KYC)" variant="elevated">
          <div className="space-y-4">
            <p className="text-sm text-pn-text-muted">
              Para adquirir tokens RWA, se requiere una identidad verificada para el registro on-chain.
            </p>
            <div className="flex justify-between items-center p-4 border border-pn-border bg-pn-surface-strong rounded-lg">
              <span className="text-sm">Estado de tu cuenta:</span>
              <UserStatusPill status={kycStatus as any} />
            </div>
            {kycStatus === "pending" ? (
              <WorkflowResultNotice type="error" title="Identidad Pendiente" message="No puedes continuar sin validación." />
            ) : (
              <div className="flex justify-end pt-4">
                <CommandButton variant="primary" onClick={nextStep}>Continuar</CommandButton>
              </div>
            )}
          </div>
        </MissionCard>
      )}

      {/* Step 1: Selección Matemática */}
      {currentStep === 1 && (
        <MissionCard title="Paso 2: Selección de Cantidad" variant="elevated">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-pn-text mb-2">Cantidad de PACHA a adquirir</label>
              <input 
                type="number" 
                min={1} 
                max={Number(property.availableTokens)} 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-pn-bg border border-pn-border rounded-md px-4 py-2 text-pn-text focus:outline-none focus:border-pn-gold"
              />
              <p className="text-xs text-pn-text-muted mt-2">Tokens disponibles: {Number(property.availableTokens).toLocaleString()}</p>
            </div>
            
            <TokenMathExplainer quantity={quantity} />

            <div className="flex justify-between pt-4">
              <CommandButton variant="outline" onClick={prevStep}>Atrás</CommandButton>
              <CommandButton variant="primary" onClick={nextStep}>Revisar Orden</CommandButton>
            </div>
          </div>
        </MissionCard>
      )}

      {/* Step 2: Revisión */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <MissionCard title="Paso 3: Checkout Simulado" variant="elevated">
            <div className="space-y-6">
              <TransactionReviewPanel 
                items={[
                  { label: "Propiedad", value: property.name },
                  { label: "Cantidad PACHA", value: quantity },
                  { label: "Precio Unitario (USD)", value: `$${PRICE_PER_PACHA.toFixed(2)}` },
                  { label: "Pasarela", value: <IntegrationStatusBadge status="PENDING_CREDENTIALS" /> },
                ]}
                totalLabel="Costo Total"
                totalValue={`$${(quantity * PRICE_PER_PACHA).toFixed(2)}`}
              />

              <div className="flex justify-between pt-4 border-t border-pn-border">
                <CommandButton variant="outline" onClick={prevStep}>Atrás</CommandButton>
                <CommandButton variant="primary" onClick={handleSimulate} disabled={isSubmitting}>
                  {isSubmitting ? "Procesando adquisición..." : "Confirmar Compra"}
                </CommandButton>
              </div>
            </div>
          </MissionCard>
        </div>
      )}

      {/* Step 3: Evidencia Sandbox + Fase142 Recibo Fideicomiso digital post-compra */}
      {currentStep === 3 && result && (
        <MissionCard title="Paso 4: Trazabilidad + Recibo Fideicomiso Digital" variant="elevated">
          <div className="space-y-6">
            <WorkflowResultNotice 
              type={result.ok ? "success" : "error"} 
              title={result.ok ? "Operación Exitosa" : "Operación Fallida"} 
              message={result.message} 
            />
            
            {result.ok && result.message.includes("Recibo Fideicomiso") && (
              <div className="p-4 border border-emerald-600/30 bg-emerald-900/10 rounded-xl">
                <div className="text-emerald-400 text-xs uppercase tracking-widest mb-1">RECIBO / SMART-CONTRACT DIGITAL (Fideicomiso)</div>
                <div className="font-mono text-sm text-white">ID: {result.message.match(/Recibo Fideicomiso: (FID-\d+)/)?.[1] || 'N/A'}</div>
                <div className="font-mono text-xs text-white/70">Hash: {result.message.match(/hash: (0x[0-9a-f.]+)/)?.[1] || 'N/A'}</div>
                <div className="text-[10px] text-white/50 mt-1">Registrado en DB (fideicomiso_audits). Ver /dashboard/fideicomiso para auditoría completa.</div>
              </div>
            )}
            
            {result.ok && (
              <div className="pt-4 flex justify-end gap-3">
                <Link href="/dashboard/investor"><CommandButton variant="outline">Ir al Portafolio</CommandButton></Link>
                <Link href="/dashboard/fideicomiso"><CommandButton variant="primary">Ver Fideicomiso</CommandButton></Link>
              </div>
            )}
            {!result.ok && (
              <div className="pt-4 flex justify-end gap-3">
                <CommandButton variant="outline" onClick={() => setCurrentStep(1)}>Modificar Orden</CommandButton>
              </div>
            )}
          </div>
        </MissionCard>
      )}
    </div>
  );
}
