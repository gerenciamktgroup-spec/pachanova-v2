import { RouteBreadcrumbs } from "@/components/mission";

export const dynamic = 'force-dynamic';

export default function P2PMarketplacePage() {
  const dummyListings = [
    { id: 1, seller: "0x4F...a9B", property: "Lotes Paracas Eco-Residencial", type: "VIVIENDA", location: "Paracas", amount: 500, pricePerToken: 0.98, discount: "-2%", total: 490 },
    { id: 2, seller: "0x8C...33D", property: "Hotel Boutique San Bartolo", type: "HOTEL", location: "Lima Sur", amount: 2000, pricePerToken: 1.05, discount: "+5%", total: 2100 },
    { id: 3, seller: "0x1A...e7F", property: "Condominio Selva Viva", type: "MIXTO", location: "Loreto", amount: 150, pricePerToken: 1.00, discount: "0%", total: 150 },
  ];

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Inversor' }, 
        { label: 'Marketplace P2P' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">Mercado Secundario (OTC)</h2>
            <p className="text-sm text-white/50">Liquidez instantánea. Compra y vende tus fracciones PACHA con otros inversores de la red.</p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors border border-white/5">
            + Crear Orden de Venta
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0f172a] p-5 rounded-xl border border-blue-500/20">
            <h3 className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Volumen 24h</h3>
            <div className="text-2xl font-semibold text-blue-400">$12,450.00</div>
          </div>
          <div className="bg-[#0f172a] p-5 rounded-xl border border-white/10">
            <h3 className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Órdenes Activas</h3>
            <div className="text-2xl font-semibold text-white">142</div>
          </div>
          <div className="bg-[#0f172a] p-5 rounded-xl border border-white/10">
            <h3 className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Spread Promedio</h3>
            <div className="text-2xl font-semibold text-white">1.2%</div>
          </div>
        </div>

        <div className="bg-[#0f172a] rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5 grid grid-cols-12 gap-4 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
            <div className="col-span-4">Activo / Vendedor</div>
            <div className="col-span-2 text-right">Cantidad</div>
            <div className="col-span-2 text-right">Precio x Token</div>
            <div className="col-span-2 text-right">Total USD</div>
            <div className="col-span-2 text-center">Acción</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {dummyListings.map((listing) => (
              <div key={listing.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-white/5 transition-colors">
                <div className="col-span-4">
                  <div className="font-medium text-sm text-white/90">{listing.property}</div>
                  <div className="text-[10px] text-white/40">{listing.type} • {listing.seller}</div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="font-medium text-sm text-white">{listing.amount} PACHA</div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="font-medium text-sm text-white">${listing.pricePerToken.toFixed(2)}</div>
                  <div className={`text-[10px] ${listing.discount.startsWith('-') ? 'text-emerald-400' : listing.discount === '0%' ? 'text-white/40' : 'text-rose-400'}`}>
                    {listing.discount} premium
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="font-medium text-sm text-[#c5a46d]">${listing.total.toFixed(2)}</div>
                </div>
                <div className="col-span-2 text-center flex justify-center">
                  <button className="bg-[#c5a46d]/20 text-[#c5a46d] hover:bg-[#c5a46d] hover:text-black px-4 py-1.5 rounded text-xs font-semibold transition-colors">
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-white/30">
            * El mercado secundario está operado mediante Smart Contracts. Las liquidaciones son instantáneas y atómicas (DVP - Delivery vs Payment).
          </p>
        </div>
      </div>
    </div>
  );
}
