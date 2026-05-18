export const dynamic = 'force-dynamic';

import { MissionCard } from "@/components/mission/MissionCard";
import { SectionHeader } from "@/components/mission/SectionHeader";
import { IntegrationStatusBadge } from "@/components/mission/IntegrationStatusBadge";
import { CommandButton } from "@/components/mission/CommandButton";
import Link from "next/link";
import { createServerClient } from "@/utils/supabase/server";
import { KycSimulationActions } from "./ControlRoomActions";

export default async function ControlRoomPage() {
  let targetInvestorId = "";

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: inv } = await supabase
      .from("investors")
      .select("id")
      .eq("supabase_auth_id", user.id)
      .single();
    if (inv) targetInvestorId = inv.id;
  }

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
              <div title="Requiere endpoint /api/demo/scenario — Sprint 8">
                <CommandButton variant="danger" disabled>Reset Demo Database</CommandButton>
              </div>
              <span className="text-xs text-pn-text-muted">(Requiere implementar /api/demo/scenario)</span>
            </div>
          </MissionCard>
        </div>

        <div className="space-y-8">
          <MissionCard title="Escenarios Simulados" data-testid="control-room-scenario-grid">
            <KycSimulationActions targetInvestorId={targetInvestorId} />

            <div className="p-4 rounded-lg border border-pn-border bg-pn-surface-strong mt-4">
              <h4 className="text-sm font-medium text-pn-text mb-2">Oracle Trigger</h4>
              <p className="text-xs text-pn-text-soft mb-4">Envía un evento de oráculo simulado para actualizar precios o metadatos.</p>
              <div title="Requiere conexión a Chainlink — disponible en producción">
                <CommandButton variant="outline" disabled>Lanzar Oracle Demo</CommandButton>
              </div>
            </div>
          </MissionCard>
        </div>
      </div>
    </div>
  );
}
