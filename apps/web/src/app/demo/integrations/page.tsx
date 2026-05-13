import { MissionCard } from "@/components/mission/MissionCard";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { IntegrationStatusBadge } from "@/components/mission/IntegrationStatusBadge";
import { ExternalReadyNotice } from "@/components/mission/ExternalReadyNotice";
import { CommandButton } from "@/components/mission/CommandButton";
import { NextStepCard } from "@/components/product/NextStepCard";

export default function IntegrationsPage() {
  return (
    <div className="space-y-8" data-testid="demo-integrations-page">
      <SectionHeader 
        title="Integration Readiness Matrix" 
        description="Estado de preparación para proveedores externos. La plataforma local bloquea por defecto cualquier conexión a producción."
      />

      <ExternalReadyNotice />

      <NextStepCard 
        contextLabel="Arquitectura"
        title="Matriz de Integraciones"
        explanation="Estás visualizando el estado técnico del Demo Mirror. Para mantener el aislamiento, los servicios productivos como MercadoPago y el Trust Anchor en Foundry están desconectados."
        nextStep="Revisa qué componentes están simulados y procede a explorar los escenarios disponibles en el Operador Demo."
        primaryAction={{ label: "Ir a Operador Demo", href: "/demo/operator", intent: "navigate" }}
        secondaryAction={{ label: "Ver Escenarios", href: "/demo/scenarios", intent: "navigate" }}
        status="READY-BUT-DISABLED"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MissionCard title="Database (PostgreSQL)" data-testid="integration-card-db">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-pn-text-soft">Persistencia Local</span>
              <IntegrationStatusBadge status="CONNECTED" />
            </div>
            <p className="text-xs text-pn-text-muted">Servicio local activo en puerto 5433.</p>
          </div>
        </MissionCard>

        <MissionCard title="Payments (MercadoPago)" data-testid="integration-card-payments">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-pn-text-soft">Checkout Pro & Webhooks</span>
              <div data-testid="integration-status-pending-credentials">
                <IntegrationStatusBadge status="PENDING_CREDENTIALS" />
              </div>
            </div>
            <p className="text-xs text-pn-text-muted">La integración de Sandbox está codificada, pero falta inyectar el Access Token en el archivo .env.demo.local.</p>
            <CommandButton variant="outline" disabled>Ver Documentación de Activación</CommandButton>
          </div>
        </MissionCard>

        <MissionCard title="Smart Contracts (Foundry)" data-testid="integration-card-contracts">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-pn-text-soft">EVM Local Node</span>
              <div data-testid="integration-status-pending-foundry">
                <IntegrationStatusBadge status="PENDING_FOUNDRY" />
              </div>
            </div>
            <p className="text-xs text-pn-text-muted">Los contratos inteligentes institucionales están preparados para compilar en un nodo Anvil local.</p>
            <CommandButton variant="outline" disabled>Ejecutar Node Anvil</CommandButton>
          </div>
        </MissionCard>

        <MissionCard title="Identity & KYC" data-testid="integration-card-kyc">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-pn-text-soft">Validación Biometría</span>
              <IntegrationStatusBadge status="SIMULATED" />
            </div>
            <p className="text-xs text-pn-text-muted">Por definir el proveedor externo. Por ahora, las aprobaciones se fuerzan desde el Control Room.</p>
          </div>
        </MissionCard>
        
        <MissionCard title="Oracle / AI / Emails" data-testid="integration-card-misc">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-pn-text-soft">Notificaciones e Ingesta</span>
              <IntegrationStatusBadge status="READY-BUT-DISABLED" />
            </div>
            <p className="text-xs text-pn-text-muted">Resend, Vercel AI SDK y Oráculos de precio están apagados para aislar la Demo Local.</p>
          </div>
        </MissionCard>
      </div>
    </div>
  );
}
