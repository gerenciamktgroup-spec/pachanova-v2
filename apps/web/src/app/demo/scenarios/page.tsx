import { RouteBreadcrumbs, SectionHeader, MissionCard } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";

export default function DemoScenariosPage() {
  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Demo" },
          { label: "Escenarios" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="Control Room Extension"
          title="Escenarios Demo"
          description="Inyecta estados simulados para visualizar diferentes contextos del producto."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MissionCard title="Contexto: Inversor" variant="elevated">
          <div className="space-y-3">
            <p className="text-xs text-pn-text-muted mb-4">Modifica el estado local de la sesión inversora.</p>
            <SafeActionButton label="Inyectar: KYC Approved" status="active" variant="outline" />
            <SafeActionButton label="Inyectar: KYC Pending" status="active" variant="outline" />
            <SafeActionButton label="Inyectar: Token Holder (500 PACHA)" status="active" variant="outline" />
          </div>
        </MissionCard>

        <MissionCard title="Contexto: Proveedores Externos" variant="elevated">
          <div className="space-y-3">
            <p className="text-xs text-pn-text-muted mb-4">Afecta la matriz de integraciones.</p>
            <SafeActionButton label="MercadoPago: Pending Credentials" status="active" variant="outline" />
            <SafeActionButton label="Foundry: Pending Nodes" status="active" variant="outline" />
            <SafeActionButton label="Force Reset (Clean DB)" href="/demo/operator" variant="danger" />
          </div>
        </MissionCard>
      </div>
    </div>
  );
}
