import { RouteBreadcrumbs } from "@/components/mission";
import { headers } from "next/headers";
import { formatCurrency, formatNumber } from "@/utils/formatters";

export const dynamic = 'force-dynamic';

export default async function InstitutionalLedgerPage() {
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  
  let ledger = [];
  try {
    const res = await fetch(`${protocol}://${host}/api/admin/audit-logs/ledger`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success) {
      ledger = data.ledger;
    }
  } catch (e) {
    console.error("Error fetching ledger", e);
  }

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Admin' }, 
        { label: 'Ledger Institucional (Hash Chain)' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>

        <div className="mb-8 relative z-10">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">Ledger Inmutable (Trazabilidad)</h2>
          <p className="text-sm text-white/50">Explorador de Hash Chain. Todas las emisiones, transferencias y quemas están ligadas criptográficamente.</p>
        </div>

        <div className="relative z-10 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                <th className="py-4 px-4 font-medium">Timestamp</th>
                <th className="py-4 px-4 font-medium">Operación</th>
                <th className="py-4 px-4 font-medium">Monto</th>
                <th className="py-4 px-4 font-medium">Previous Hash</th>
                <th className="py-4 px-4 font-medium">Current Hash</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ledger.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/40">No hay registros en el Ledger.</td>
                </tr>
              ) : (
                ledger.map((entry: any, i: number) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors font-mono">
                    <td className="py-4 px-4 text-white/60">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        entry.operation === 'mint' ? 'bg-[#c5a46d]/10 text-[#c5a46d] border border-[#c5a46d]/20' : 
                        entry.operation === 'transfer' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {entry.operation.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      {formatNumber(entry.amount)} <span className="text-xs text-white/30">PACHA</span>
                    </td>
                    <td className="py-4 px-4 text-xs text-white/40 truncate max-w-[150px]" title={entry.previousHash}>
                      {entry.previousHash === '0x0000000000000000000000000000000000000000000000000000000000000000' 
                        ? 'GENESIS BLOCK' 
                        : `${entry.previousHash.substring(0, 16)}...`}
                    </td>
                    <td className="py-4 px-4 text-xs text-emerald-400/70 truncate max-w-[150px]" title={entry.currentHash}>
                      {entry.currentHash.substring(0, 16)}...
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
