import { RouteBreadcrumbs } from "@/components/mission";
import AdminKycClient from "./AdminKycClient";

export const dynamic = 'force-dynamic';

export default function AdminKycPage() {
  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Admin' }, 
        { label: 'Revisión KYC & AML' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
        
        <div className="mb-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-emerald-400 mb-1">Revisión de Cumplimiento (KYC)</h2>
            <p className="text-sm text-white/50">Centro de revisión y aprobación manual de documentos de identidad de inversores.</p>
          </div>
          
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm text-white/80 font-medium">12 Pendientes</span>
          </div>
        </div>

        <div className="relative z-10">
          <AdminKycClient />
        </div>
      </div>
    </div>
  );
}
