import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { Building2, PieChart, TrendingUp, Coins } from "lucide-react";

import { sql } from "drizzle-orm";

export default async function LandbankAnalytics() {
  let properties: any[] = [];
  try {
    const rawProps = await db.execute(sql`SELECT * FROM public.properties`);
    properties = rawProps as any[];
  } catch (err) {
    console.error("Error querying properties for analytics:", err);
  }
  const distributions = await db.query.distributions.findMany();
  const balances = await db.query.balances.findMany();

  const totalValuation = properties.reduce((acc, p) => acc + Number(p.totalValuationUsd || 0), 0);
  const totalYieldDistributed = distributions.reduce((acc, d) => acc + Number(d.amountUsd || 0), 0);
  
  const tokensAvailable = properties.reduce((acc, p) => acc + Number(p.availableTokens || 0), 0);
  const tokensDistributed = balances.reduce((acc, b) => acc + Number(b.availableTokens || 0) + Number(b.lockedTokens || 0), 0);
  const totalTokens = tokensAvailable + tokensDistributed;

  const phaseCounts = properties.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#0f172a] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs uppercase text-white/50 tracking-wider font-semibold">Valuación Total (AUM)</p>
            <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(totalValuation)}</h3>
          </div>
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Building2 className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
        <p className="text-xs text-white/40">Suma de todos los activos en Landbank</p>
      </div>

      <div className="bg-[#0f172a] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs uppercase text-white/50 tracking-wider font-semibold">Distribución de Fases</p>
            <div className="flex gap-3 mt-1">
              <span className="text-sm"><span className="text-blue-400 font-bold">{phaseCounts['funding'] || 0}</span> FND</span>
              <span className="text-sm"><span className="text-emerald-400 font-bold">{phaseCounts['trading'] || 0}</span> TRD</span>
              <span className="text-sm"><span className="text-gray-400 font-bold">{phaseCounts['coming_soon'] || 0}</span> CS</span>
            </div>
          </div>
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <PieChart className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <p className="text-xs text-white/40">Total activos: {properties.length}</p>
      </div>

      <div className="bg-[#0f172a] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs uppercase text-white/50 tracking-wider font-semibold">Rendimiento Histórico</p>
            <h3 className="text-2xl font-bold text-[#c5a46d] mt-1">{formatCurrency(totalYieldDistributed)}</h3>
          </div>
          <div className="p-2 bg-[#c5a46d]/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-[#c5a46d]" />
          </div>
        </div>
        <p className="text-xs text-white/40">Total de yields pagados a inversores</p>
      </div>

      <div className="bg-[#0f172a] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs uppercase text-white/50 tracking-wider font-semibold">Tokens (Circulación)</p>
            <h3 className="text-2xl font-bold text-white mt-1">{tokensDistributed.toLocaleString()}</h3>
          </div>
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Coins className="w-5 h-5 text-purple-500" />
          </div>
        </div>
        <div className="w-full bg-black rounded-full h-1.5 mt-2">
          <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${totalTokens > 0 ? (tokensDistributed/totalTokens)*100 : 0}%` }}></div>
        </div>
        <p className="text-xs text-white/40 mt-1">{((totalTokens > 0 ? tokensDistributed/totalTokens : 0)*100).toFixed(1)}% distribuidos</p>
      </div>
    </div>
  );
}
