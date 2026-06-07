import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { RouteBreadcrumbs } from "@/components/mission";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function PartnerSubmitPage() {
  async function submitProperty(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const propertyType = formData.get("propertyType") as string;

    let mappedType: "land" | "residential" | "hotel" | "rental" = "land";
    if (propertyType === "AGRICOLA") mappedType = "land";
    else if (propertyType === "HOTEL") mappedType = "hotel";
    else if (propertyType === "VIVIENDA") mappedType = "residential";
    else if (propertyType === "MIXTO") mappedType = "rental";

    await db.insert(schema.properties).values({
      name: name,
      location: location,
      propertyType: mappedType,
      status: "coming_soon",
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop",
      tokenPriceUsd: "0.00",
      totalValuationUsd: "0.00",
      totalTokens: "0.00",
      availableTokens: "0.00",
      annualYieldExpected: "0.00",
      isDemo: false // fixed per v3 45m loop demo0 strict + Master safety (was remnant)
    });

    revalidatePath("/dashboard/admin/properties");
    redirect("/dashboard/partner/success");
  }

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Portal de Socios' }, 
        { label: 'Subir Terreno' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-[#c5a46d] mb-2">Aportar Terreno al Landbank</h2>
        <p className="text-sm text-white/50 mb-8">
          Envía los detalles de tu predio para ser evaluado por PachaNova. Si califica, pasará al pool global de tokenización.
        </p>

        <form action={submitProperty} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1 uppercase tracking-wider">Nombre del Proyecto o Fundo</label>
            <input name="name" required className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a46d] transition-colors" placeholder="Ej: Fundo Paracas Eco-Resort" />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1 uppercase tracking-wider">Ubicación</label>
            <input name="location" required className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a46d] transition-colors" placeholder="Ej: Ica, Paracas" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1 uppercase tracking-wider">Tipo de Uso</label>
              <select name="propertyType" className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a46d] transition-colors">
                <option value="AGRICOLA">Agroindustrial</option>
                <option value="HOTEL">Hotelería / Resort</option>
                <option value="VIVIENDA">Desarrollo de Vivienda</option>
                <option value="MIXTO">Uso Mixto</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1 uppercase tracking-wider">Extensión (Hectáreas)</label>
              <input name="has" required type="number" step="0.1" className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a46d] transition-colors" placeholder="Ej: 5.5" />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full bg-[#c5a46d] hover:bg-[#d4b47d] text-[#0a111f] font-semibold px-4 py-3 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(197,164,109,0.3)]">
              Enviar Propuesta
            </button>
            <p className="text-center text-[10px] text-white/40 mt-4">
              Al enviar, aceptas que PachaNova audite legal y financieramente el activo para su posible inclusión en la red de RWA.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
