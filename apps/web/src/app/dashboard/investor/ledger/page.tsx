import { RouteBreadcrumbs, SectionHeader, MissionCard, EmptyState, SafeActionButton } from "@/components/mission";

export default function InvestorLedgerPage() {
  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor", href: "/dashboard/investor" },
          { label: "Ledger PACHA" }
        ]} className="mb-4" />
        <SectionHeader 
          eyebrow="On-Chain (Simulated)"
          title="Ledger PACHA"
          description="Historial inmutable de transferencias del token simulado en el Sandbox local."
        />
      </div>

      <MissionCard>
        <EmptyState 
          title="No hay transacciones"
          description="Aún no has recibido tokens PACHA en este entorno."
        />
      </MissionCard>
      
      <div className="flex justify-end">
        <SafeActionButton label="Volver al Panel" href="/dashboard/investor" variant="ghost" />
      </div>
    </div>
  );
}
