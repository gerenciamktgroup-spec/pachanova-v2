import { RouteBreadcrumbs, SectionHeader, ErrorState, SafeActionButton } from "@/components/mission";
import { InvestorLedgerPanel } from "@/components/product";
import { fetchInvestorData } from "@/lib/data/fetchInvestorData";
import { requireRole } from "@/utils/auth/requireRole";

export default async function InvestorLedgerPage() {
  await requireRole(["investor"]);
  const view = await fetchInvestorData();

  if (!view) {
    return <ErrorState title="Error de carga" message="No pudimos cargar el ledger. Verificá tu identidad antes de operar." />;
  }

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

      <InvestorLedgerPanel view={view} />
      
      <div className="flex justify-end mt-4">
        <SafeActionButton label="Volver al Panel" href="/dashboard/investor" variant="ghost" />
      </div>
    </div>
  );
}
