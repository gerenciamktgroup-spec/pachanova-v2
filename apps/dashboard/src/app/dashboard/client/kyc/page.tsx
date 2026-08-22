import { RouteBreadcrumbs } from "@/components/mission";
import KycPanel from "../../investor/kyc/KycPanel";

export const dynamic = "force-dynamic";

export default function ClientKycPage() {
  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[{ label: "Cliente" }, { label: "KYC" }]} />
      <div className="bg-[#0a111f] text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">Verificación KYC</h2>
        <p className="text-sm text-white/50 mb-6">Identidad del comprador o arrendatario.</p>
        <KycPanel />
      </div>
    </div>
  );
}
