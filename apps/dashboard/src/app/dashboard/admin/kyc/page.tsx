import { RouteBreadcrumbs } from "@/components/mission";
import KycQueue from "./KycQueue";

export const dynamic = "force-dynamic";

export default function AdminKycPage() {
  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[{ label: "Admin" }, { label: "KYC" }]} />
      <div className="bg-[#0a111f] text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">Revisión KYC</h2>
        <p className="text-sm text-white/50 mb-6">Aprueba o rechaza documentos de inversores y clientes.</p>
        <KycQueue />
      </div>
    </div>
  );
}
