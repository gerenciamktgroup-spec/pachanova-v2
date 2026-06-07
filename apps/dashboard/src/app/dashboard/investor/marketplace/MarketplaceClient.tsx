"use client";

import { useState } from "react";
import { ArrowRightLeft, TrendingUp, TrendingDown, Tag, Clock, CheckCircle2 } from "lucide-react";
import { createP2POrder, initiateP2PTrade } from "@/app/actions/p2p";
import { useRouter } from "next/navigation";

export function MarketplaceClient({ orders, properties }: { orders: any[], properties: any[] }) {
  const [activeTab, setActiveTab] = useState<"book" | "my_orders">("book");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
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
      alert("Transacción P2P enviada. Esperando aprobación de Tesorería.");
      router.refresh();
    } else {
      alert("Error al comprar: " + res.error);
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
                <table className="w-full text-left text-sm">
                  <thead className="bg-pn-surface-strong/50 border-b border-pn-border text-pn-text-soft">
                    <tr>
                      <th className="px-6 py-4 font-medium">Bóveda (Proyecto)</th>
                      <th className="px-6 py-4 font-medium">Fracciones</th>
                      <th className="px-6 py-4 font-medium">Precio P2P</th>
                      <th className="px-6 py-4 font-medium">Diferencial</th>
                      <th className="px-6 py-4 font-medium text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pn-border/50">
                    {orders.map((order) => {
                      const currentMarketPrice = parseFloat(order.property?.tokenPriceUsd || "1");
                      const orderPrice = parseFloat(order.pricePerToken);
                      const discount = ((orderPrice - currentMarketPrice) / currentMarketPrice) * 100;
                      const isDiscount = discount < 0;

                      return (
                        <tr key={order.id} className="hover:bg-pn-surface-strong/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-pn-text">
                            {order.property?.name || "Propiedad Desconocida"}
                          </td>
                          <td className="px-6 py-4 text-pn-text-soft">
                            {order.quantity} Tokens
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-pn-gold">${orderPrice.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1 text-xs font-medium ${isDiscount ? 'text-pn-success' : 'text-pn-danger'}`}>
                              {isDiscount ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                              {Math.abs(discount).toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleBuy(order.id)}
                              disabled={isProcessing === order.id}
                              className="px-4 py-1.5 bg-pn-surface-strong hover:bg-pn-gold hover:text-black border border-pn-border hover:border-pn-gold rounded-md text-pn-text text-xs font-medium transition-all"
                            >
                              {isProcessing === order.id ? "Procesando..." : "Comprar"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                  <span>Los precios P2P son definidos libremente por los vendedores.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-pn-gold shrink-0 mt-0.5" />
                  <span>Al comprar, la orden pasa a un estado <strong>Pendiente de Aprobación</strong> por la Tesorería.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-pn-gold shrink-0 mt-0.5" />
                  <span>Se aplica un Fee de red del <strong>3.4%</strong> para mantener la liquidez institucional.</span>
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
    </>
  );
}
