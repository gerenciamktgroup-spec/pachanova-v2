import { RouteBreadcrumbs } from "@/components/mission";
import KycClient from "./KycClient";

export const dynamic = 'force-dynamic';

export default function KycPage() {
  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Inversor' }, 
        { label: 'Verificación de Identidad (KYC)' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c5a46d]/5 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40"></div>

        <div className="mb-8 relative z-10">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">Verificación KYC</h2>
          <p className="text-sm text-white/50">Sube tus documentos de identidad para cumplir con las regulaciones y acceder a todos los mercados secundarios y primarios.</p>
        </div>

        <div className="relative z-10">
          <KycClient />
        </div>
      </div>
    </div>
  );
}
