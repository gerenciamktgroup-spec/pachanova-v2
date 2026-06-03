import { RouteBreadcrumbs } from "@/components/mission";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { schema } from "@pachanova/database";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function AdminPropertyDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client, { schema });

  const property = await db.query.properties.findFirst({
    where: eq(schema.properties.id, params.id)
  });

  if (!property) return <div>Propiedad no encontrada</div>;

  async function tokenizeAction(formData: FormData) {
    "use server";
    const totalTokens = formData.get("totalTokens") as string;
    const tokenPrice = formData.get("tokenPrice") as string;
    const apy = formData.get("apy") as string;
    
    const client = postgres(process.env.DATABASE_URL!);
    const db = drizzle(client, { schema });

    await db.update(schema.properties).set({
      totalTokens: totalTokens,
      tokenPriceUsd: tokenPrice,
      annualYieldExpected: apy,
      status: "TOKENIZED"
    }).where(eq(schema.properties.id, params.id));

    revalidatePath(`/dashboard/admin/properties/${params.id}`);
    revalidatePath("/dashboard/investor"); // Refresh investor view
  }

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Admin' }, 
        { label: 'Gestión de Proyectos', href: '/dashboard/admin/properties' },
        { label: property.name }
      ]} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0a111f] rounded-2xl border border-white/10 p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">{property.name}</h2>
              <p className="text-sm text-white/50">{property.location} • {property.propertyType}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
              property.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' :
              property.status === 'TOKENIZED' ? 'bg-[#c5a46d]/20 text-[#c5a46d]' : 'bg-white/10 text-white/60'
            }`}>
              {property.status}
            </span>
          </div>

          <div className="aspect-video w-full rounded-xl overflow-hidden bg-white/5 mb-8">
            <img src={property.imageUrl} alt="Property" className="w-full h-full object-cover" />
          </div>

          {property.status === 'ACTIVE' && (
            <div className="bg-[#0f172a] rounded-xl border border-[#c5a46d]/30 p-6">
              <h3 className="text-lg font-medium text-[#c5a46d] mb-4">⚙️ Fábrica de Productos Financieros</h3>
              <p className="text-sm text-white/60 mb-6">Convierte este activo físico en un instrumento financiero RWA definiendo sus parámetros de emisión en la blockchain.</p>
              
              <form action={tokenizeAction} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">Total Tokens a Emitir</label>
                    <input name="totalTokens" required type="number" className="w-full bg-[#0a111f] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a46d] outline-none" placeholder="Ej: 5000000" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">Precio x Token (USD)</label>
                    <input name="tokenPrice" required type="number" step="0.01" className="w-full bg-[#0a111f] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a46d] outline-none" placeholder="Ej: 1.00" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">APY Proyectado (%)</label>
                    <input name="apy" required type="number" step="0.1" className="w-full bg-[#0a111f] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a46d] outline-none" placeholder="Ej: 12.5" />
                  </div>
                </div>
                <button type="submit" className="w-full mt-4 bg-[#c5a46d] text-black font-semibold rounded py-2 hover:bg-[#d4b47d] transition-colors">
                  Ejecutar Tokenización On-Chain
                </button>
              </form>
            </div>
          )}

          {property.status === 'TOKENIZED' && (
            <div className="bg-emerald-500/10 rounded-xl border border-emerald-500/20 p-6 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-lg font-medium text-emerald-400 mb-2">Activo Tokenizado y En Venta</h3>
              <p className="text-sm text-white/60">Este proyecto ya está generando rendimientos y está disponible en el marketplace público y en el dashboard de inversores.</p>
              
              <div className="grid grid-cols-3 gap-8 mt-6 pt-6 border-t border-emerald-500/20 w-full">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50">Suministro Total</div>
                  <div className="text-lg text-white">{Number(property.totalTokens).toLocaleString()} PACHA</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50">Precio Unidad</div>
                  <div className="text-lg text-white">${property.tokenPriceUsd}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50">APY Estimado</div>
                  <div className="text-lg text-emerald-400">{property.annualYieldExpected}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-[#0a111f] rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-4">Orquestador Grok</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="text-[10px] text-emerald-400 mb-1">Estado de Sincronización</div>
                <div className="text-xs text-white/70">Escuchando Webhooks en `/api/webhooks/grok`</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="text-[10px] text-[#c5a46d] mb-1">Contrato Inteligente</div>
                <div className="text-xs text-white/70">{property.status === 'TOKENIZED' ? '0xDeployed...' : 'Pendiente de tokenización'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
