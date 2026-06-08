"use client";

import { useState } from "react";
import { ArrowRightLeft, TrendingUp, TrendingDown, Tag, Clock, CheckCircle2, Shield } from "lucide-react";
import { createP2POrder, initiateP2PTrade } from "@/app/actions/p2p";
import { useRouter } from "next/navigation";
import { PropertyDataRoom } from "./PropertyDataRoom";

export function MarketplaceClient({ orders, properties }: { orders: any[], properties: any[] }) {
  const [activeTab, setActiveTab] = useState<"book" | "my_orders">("book");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [activeDataRoom, setActiveDataRoom] = useState<string | null>(null);
  const router = useRouter();

  // New Order Form state
  const [selectedProperty, setSelectedProperty] = useState(properties[0]?.id || "");
  const [sellQuantity, setSellQuantity] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleBuy = async (orderId: string) => {
    setIsProcessing(orderId);
    const res = await initiateP2PTrade(orderId);
    setIsProcessing(null);
    if (res.success) {
      alert("Negociación P2P Iniciada. Por favor, coordina el pago FIAT con el vendedor directamente (fuera de la plataforma). Los tokens han sido bloqueados en Escrow.");
      router.refresh();
    } else {
      alert("Error al iniciar negociación: " + res.error);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const res = await createP2POrder(selectedProperty, parseFloat(sellQuantity), parseFloat(sellPrice));
    setIsCreating(false);
    
    if (res.success) {
      alert("Orden de venta publicada en el mercado.");
      setSellQuantity("");
      setSellPrice("");
      setActiveTab("book");
      router.refresh();
    } else {
      alert("Error al publicar orden: " + res.error);
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-pn-border/50">
        <button
          onClick={() => setActiveTab("book")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "book" ? "border-pn-gold text-pn-gold" : "border-transparent text-pn-text-soft hover:text-pn-text"
          }`}
        >
          Libro de Órdenes
        </button>
        <button
          onClick={() => setActiveTab("my_orders")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "my_orders" ? "border-pn-gold text-pn-gold" : "border-transparent text-pn-text-soft hover:text-pn-text"
          }`}
        >
          Mis Órdenes (Crear)
        </button>
      </div>

      {activeTab === "book" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-pn-text flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-pn-gold" />
              Mercado Abierto
            </h2>
            
            <div className="bg-pn-surface/50 border border-pn-border rounded-xl overflow-hidden">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-pn-text-soft text-sm">
                  No hay órdenes de venta públicas en este momento.
                </div>
              ) : (
                <div className="flex flex-col text-sm">
                  <div className="grid grid-cols-5 px-6 py-3 bg-pn-surface-strong/50 border-b border-pn-border text-pn-text-soft font-medium uppercase text-xs tracking-wider">
                    <div className="col-span-2">Propiedad / Bóveda</div>
                    <div className="text-right">Precio (USD)</div>
                    <div className="text-right">Cantidad</div>
                    <div className="text-right">Acción</div>
                  </div>
                  <div className="divide-y divide-pn-border/30 relative">
                    {/* Simulated Depth Bar Backgrounds */}
                    {orders.map((order, idx) => {
                      const currentMarketPrice = parseFloat(order.property?.tokenPriceUsd || "1");
                      const orderPrice = parseFloat(order.pricePerToken);
                      const discount = ((orderPrice - currentMarketPrice) / currentMarketPrice) * 100;
                      const isDiscount = discount < 0;
                      const depthPercentage = Math.min(100, Math.max(10, (parseFloat(order.quantity) / 1000) * 100)); // Simulación de profundidad

                      return (
                        <div key={order.id} className="grid grid-cols-5 px-6 py-3 hover:bg-pn-surface-strong/30 transition-colors relative group items-center">
                          {/* Depth Bar */}
                          <div 
                            className="absolute right-0 top-0 bottom-0 bg-pn-danger/5 opacity-50 transition-all group-hover:opacity-70" 
                            style={{ width: `${depthPercentage}%` }}
                          />
                          
                          <div className="col-span-2 relative z-10 flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-pn-text">{order.property?.name || "Propiedad Desconocida"}</span>
                              <button 
                                onClick={() => setActiveDataRoom(order.property?.name || "Propiedad")}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#c5a46d]/10 hover:bg-[#c5a46d]/20 text-[#c5a46d] text-[10px] font-medium transition-colors"
                              >
                                <Shield className="w-3 h-3" /> Data Room
                              </button>
                            </div>
                            <div className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide mt-0.5 ${isDiscount ? 'text-pn-success' : 'text-pn-danger'}`}>
                              {isDiscount ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                              {Math.abs(discount).toFixed(2)}% {isDiscount ? "Descuento" : "Premium"}
                            </div>
                          </div>
                          
                          <div className="text-right relative z-10 font-mono font-medium text-pn-danger">
                            ${orderPrice.toFixed(2)}
                          </div>
                          
                          <div className="text-right relative z-10 font-mono text-pn-text-soft">
                            {order.quantity}
                          </div>
                          
                          <div className="text-right relative z-10">
                            <button
                              onClick={() => handleBuy(order.id)}
                              disabled={isProcessing === order.id}
                              className="px-4 py-1.5 bg-pn-success/10 hover:bg-pn-success hover:text-white border border-pn-success/20 text-pn-success text-xs font-medium rounded transition-all w-28 whitespace-nowrap"
                            >
                              {isProcessing === order.id ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto"/> : "Iniciar Escrow"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Lateral */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-pn-border/50 bg-gradient-to-br from-pn-surface-strong/20 to-transparent">
              <h3 className="font-semibold text-pn-text mb-4">Mecánica del Mercado</h3>
              <ul className="space-y-3 text-sm text-pn-text-soft">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pn-gold shrink-0 mt-0.5" />
                  <span>Los precios P2P son definidos libremente por los vendedores. PachaNova no influye.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-pn-gold shrink-0 mt-0.5" />
                  <span>Al iniciar un Escrow, la orden se bloquea. El pago FIAT se debe coordinar por fuera con el vendedor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-pn-gold shrink-0 mt-0.5" />
                  <span>Se aplica un Fee de Red P2P del <strong>5%</strong> descontado de los tokens (comprador).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="p-6 rounded-xl border border-pn-border bg-pn-surface-strong/30 backdrop-blur-sm space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-pn-text mb-1">Nueva Orden de Venta</h2>
              <p className="text-sm text-pn-text-soft">
                Crea liquidez vendiendo tus fracciones. Tú defines el precio.
              </p>
            </div>
            
            <form className="space-y-4" onSubmit={handleCreateOrder}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-pn-text-muted">Bóveda (Propiedad)</label>
                <select 
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full px-4 py-3 bg-pn-bg border border-pn-border rounded-lg focus:outline-none focus:ring-1 focus:ring-pn-gold text-pn-text transition-colors"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Valor mercado: ${p.tokenPriceUsd})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-pn-text-muted">Cantidad a Vender</label>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    value={sellQuantity}
                    onChange={(e) => setSellQuantity(e.target.value)}
                    className="w-full px-4 py-3 bg-pn-bg border border-pn-border rounded-lg focus:outline-none focus:ring-1 focus:ring-pn-gold text-pn-text transition-colors" 
                    placeholder="Ej. 100" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-pn-text-muted">Precio por Token (USD)</label>
                  <input 
                    type="number" 
                    required 
                    min="0.01" 
                    step="0.01" 
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-pn-bg border border-pn-border rounded-lg focus:outline-none focus:ring-1 focus:ring-pn-gold text-pn-text transition-colors" 
                    placeholder="Ej. 8.50" 
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="w-full bg-pn-gold hover:bg-pn-gold/90 disabled:opacity-50 text-black font-semibold py-3 px-4 rounded-lg transition-all"
                >
                  {isCreating ? "Publicando..." : "Publicar Oferta P2P"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Data Room */}
      {activeDataRoom && (
        <PropertyDataRoom 
          propertyName={activeDataRoom} 
          onClose={() => setActiveDataRoom(null)} 
        />
      )}
    </>
  );
}
