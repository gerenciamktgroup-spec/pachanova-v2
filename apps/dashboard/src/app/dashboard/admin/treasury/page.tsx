import { RouteBreadcrumbs } from "@/components/mission";
import TreasuryClient from "./TreasuryClient";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function AdminTreasuryPage() {
  // Fetch data directly from our API route to keep it simple and reusable
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  
  const res = await fetch(`${protocol}://${host}/api/treasury`, {
    cache: 'no-store'
  });
  
  const data = await res.json();

  if (!data.success) {
    return (
      <div className="space-y-6">
        <RouteBreadcrumbs items={[{ label: 'Admin' }, { label: 'Bóveda Central' }]} />
        <div className="bg-rose-500/10 p-6 rounded-xl border border-rose-500/20 text-rose-400">
          Error al cargar los datos de la bóveda: {data.error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Admin' }, 
        { label: 'Bóveda Central (Double-Entry Ledger)' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden">
        {/* Futuristic Background accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c5a46d]/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40"></div>

        <div className="mb-8 relative z-10">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">Tesorería & Bóveda PachaNova</h2>
          <p className="text-sm text-white/50">Centro de comando para la emisión, custodia P2P y liquidación de activos reales tokenizados.</p>
        </div>

        <div className="relative z-10">
          <TreasuryClient metrics={data.metrics} vaults={data.vaults} />
        </div>
      </div>
    </div>
  );
}
