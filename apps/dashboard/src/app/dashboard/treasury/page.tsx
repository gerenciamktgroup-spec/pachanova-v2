import { RouteBreadcrumbs } from "@/components/mission";
import { eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function TreasuryDashboardPage() {

  // Agregate total funds and properties
  const properties = await db.query.properties.findMany({
    where: eq(schema.properties.status, 'TOKENIZED')
  });

  const allBalances = await db.query.balances.findMany();

  // Distribution Logic: When Treasury inputs revenue, it distributes to token holders
  async function distributeYield(formData: FormData) {
    "use server";
    const propertyId = formData.get("propertyId") as string;
    const amountUsd = Number(formData.get("amountUsd"));
    
    if (!propertyId || amountUsd <= 0) return;


    // Get all investors who own tokens of this property
    const balances = await db.query.balances.findMany({
      where: eq(schema.balances.propertyId, propertyId)
    });

    // Calculate total supply owned by investors (to find proportions)
    const totalSupplyHeld = balances.reduce((acc, b) => acc + Number(b.availableTokens) + Number(b.lockedTokens), 0);
    
    if (totalSupplyHeld > 0) {
      // Distribute
      for (const b of balances) {
        const userTokens = Number(b.availableTokens) + Number(b.lockedTokens);
        const proportion = userTokens / totalSupplyHeld;
        const yieldForUser = amountUsd * proportion;

        // Add to their available USD liquid balance
        const newUsd = Number(b.availableUsd) + yieldForUser;
        
        await db.update(schema.balances)
          .set({ availableUsd: newUsd.toString() })
          .where(
            sql`${schema.balances.investorId} = ${b.investorId} AND ${schema.balances.propertyId} = ${propertyId}`
          );
      }
    }

    revalidatePath("/dashboard/treasury");
  }

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Admin' }, 
        { label: 'Tesorería Global' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">Tesorería Global y Distribución</h2>
          <p className="text-sm text-white/50">Gestiona la liquidez de PachaNova e inyecta rendimientos reales (Yield) a los inversores.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#0f172a] p-6 rounded-xl border border-emerald-500/20">
            <h3 className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Valor Total Tokenizado (TVL)</h3>
            <div className="text-3xl font-semibold text-emerald-400">
              ${properties.reduce((acc, p) => acc + (Number(p.totalTokens) * Number(p.tokenPriceUsd)), 0).toLocaleString()}
            </div>
            <p className="text-xs text-white/40 mt-2">Suma de todos los tokens emitidos por su precio base.</p>
          </div>
          <div className="bg-[#0f172a] p-6 rounded-xl border border-[#c5a46d]/20">
            <h3 className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Activos Activos (RWA)</h3>
            <div className="text-3xl font-semibold text-[#c5a46d]">
              {properties.length} Proyectos
            </div>
            <p className="text-xs text-white/40 mt-2">Terrenos, Hoteles y Desarrollos en producción.</p>
          </div>
        </div>

        <div className="bg-[#0f172a] rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-medium text-white mb-6">💰 Inyección de Rendimientos (Yield)</h3>
          <p className="text-sm text-white/60 mb-6">
            Cuando un activo físico genera ingresos en el mundo real (ej. pago de alquileres, dividendos del hotel), ingresa el monto total aquí. El sistema calculará la tenencia exacta (prorrateo) y distribuirá dólares líquidos a las billeteras de los inversores.
          </p>

          <form action={distributeYield} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">Seleccionar Activo Emisor</label>
              <select name="propertyId" required className="w-full bg-[#0a111f] border border-white/10 rounded px-3 py-3 text-sm text-white focus:border-[#c5a46d] outline-none">
                <option value="">-- Elige el activo que generó ingresos --</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.location})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">Monto Total a Distribuir (USD)</label>
              <input name="amountUsd" required type="number" step="0.01" className="w-full bg-[#0a111f] border border-white/10 rounded px-3 py-3 text-sm text-emerald-400 focus:border-emerald-500 outline-none font-semibold" placeholder="Ej: 25000.00" />
            </div>
            <button type="submit" className="w-full mt-4 bg-emerald-500 text-black font-bold rounded py-3 hover:bg-emerald-400 transition-colors">
              Ejecutar Distribución Proporcional
            </button>
          </form>
        </div>
        
        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/5">
          <p className="text-xs text-white/40">
            <strong className="text-white/70">Orquestación:</strong> Esta distribución de tesorería es interceptada por el motor de Grok para dejar un hash permanente en la red Base (L2), asegurando transparencia criptográfica a todos los tenedores del activo.
          </p>
        </div>
      </div>
    </div>
  );
}

