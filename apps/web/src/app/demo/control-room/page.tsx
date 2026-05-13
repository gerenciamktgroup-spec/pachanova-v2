import { MissionCard } from "@/components/mission/MissionCard";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { IntegrationStatusBadge } from "@/components/mission/IntegrationStatusBadge";
import { CommandButton } from "@/components/mission/CommandButton";
import Link from "next/link";

export default function ControlRoomPage() {
  return (
    <div className="space-y-8" data-testid="demo-control-room-page">
      <SectionHeader 
        title="Control Room" 
        description="Centro operativo de la Demo. Gestiona el estado local y lanza simulaciones aisladas."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <MissionCard title="Environment Status" data-testid="control-room-environment-status">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-pn-text">Database (Local Sandbox)</span>
                <IntegrationStatusBadge status="CONNECTED" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-pn-text">Demo Mode</span>
                <IntegrationStatusBadge status="SIMULATED" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-pn-text">External Interactions</span>
                <IntegrationStatusBadge status="READY-BUT-DISABLED" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-pn-text">Production / Staging</span>
                <IntegrationStatusBadge status="NO-GO" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-pn-border">
              <Link href="/demo/integrations">
                <CommandButton variant="outline" className="w-full justify-center">Ver Configuración Externa</CommandButton>
              </Link>
            </div>
          </MissionCard>

          <MissionCard title="Data Reset & Seeding">
            <p className="text-sm text-pn-text-soft mb-4">
              Restaura la base de datos a su estado demo inicial. Esta acción eliminará todas las transacciones simuladas previas.
            </p>
            <div className="flex gap-4 items-center" data-testid="control-room-reset-action">
              <CommandButton variant="danger" disabled>Reset Demo Database</CommandButton>
              <span className="text-xs text-pn-text-muted">(Requiere implementar /api/demo/scenario)</span>
            </div>
          </MissionCard>
        </div>

        <div className="space-y-8">
          <MissionCard title="Escenarios Simulados" data-testid="control-room-scenario-grid">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-pn-border bg-pn-surface-strong">
                <h4 className="text-sm font-medium text-pn-text mb-2">Investor KYC: Approved</h4>
                <p className="text-xs text-pn-text-soft mb-4">Simula que el inversor predeterminado ha sido aprobado para participar en la Genesis.</p>
                <CommandButton variant="outline" disabled>Simular Approved</CommandButton>
              </div>

              <div className="p-4 rounded-lg border border-pn-border bg-pn-surface-strong">
                <h4 className="text-sm font-medium text-pn-text mb-2">Investor KYC: Pending</h4>
                <p className="text-xs text-pn-text-soft mb-4">Simula que el inversor predeterminado sigue en evaluación.</p>
                <CommandButton variant="outline" disabled>Simular Pending</CommandButton>
              </div>

              <div className="p-4 rounded-lg border border-pn-border bg-pn-surface-strong">
                <h4 className="text-sm font-medium text-pn-text mb-2">Oracle Trigger</h4>
                <p className="text-xs text-pn-text-soft mb-4">Envía un evento de oráculo simulado para actualizar precios o metadatos.</p>
                <CommandButton variant="outline" disabled>Lanzar Oracle Demo</CommandButton>
              </div>
            </div>
          </MissionCard>
        </div>
      </div>
    </div>
  );
}
