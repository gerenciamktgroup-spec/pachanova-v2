import { RouteBreadcrumbs } from "@/components/mission";
import GovernanceClient from "./GovernanceClient";

export const dynamic = 'force-dynamic';

export default function GovernancePage() {
  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Inversor' }, 
        { label: 'Gobernanza y Votaciones' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c5a46d]/5 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40"></div>

        <div className="mb-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-purple-400 mb-1">Gobernanza de la Red</h2>
            <p className="text-sm text-white/50">Ejerce tu poder de voto (PACHA Power) en decisiones clave sobre las propiedades y el protocolo.</p>
          </div>
          
          <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10 flex items-center gap-4">
            <div>
              <span className="text-xs text-white/50 uppercase tracking-wider block">Tu Poder de Voto</span>
              <span className="text-lg font-bold text-[#c5a46d]">1,250 <span className="text-sm font-medium">PACHA</span></span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <span className="text-xs text-white/50 uppercase tracking-wider block">Peso</span>
              <span className="text-lg font-bold text-white">0.4%</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <GovernanceClient />
        </div>
      </div>
    </div>
  );
}
