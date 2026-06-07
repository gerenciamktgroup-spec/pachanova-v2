"use client";

import { useState } from "react";
import { RouteBreadcrumbs } from "@/components/mission";
import { ArrowRightLeft, TrendingUp, TrendingDown, Tag, Clock, CheckCircle2 } from "lucide-react";

// Mock data para el libro de órdenes
const MOCK_ORDERS = [
  { id: "ord-001", property: "San Bartolo", type: "SELL", tokens: 100, price: 8.00, originalPrice: 8.50, seller: "Usuario_X" },
  { id: "ord-002", property: "Resort Paracas", type: "SELL", tokens: 50, price: 52.00, originalPrice: 50.00, seller: "Usuario_Y" },
  { id: "ord-003", property: "San Bartolo", type: "SELL", tokens: 250, price: 8.20, originalPrice: 8.50, seller: "Usuario_Z" },
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<"book" | "my_orders">("book");
  const [isBuying, setIsBuying] = useState<string | null>(null);

  const handleBuy = (id: string) => {
    setIsBuying(id);
    setTimeout(() => {
      setIsBuying(null);
      alert("Transacción P2P enviada. Esperando aprobación del Administrador Maestro.");
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <RouteBreadcrumbs />
        <h1 className="text-3xl font-light tracking-tight text-pn-text">
          Marketplace <span className="font-semibold text-pn-gold">P2P</span>
        </h1>
        <p className="text-pn-text-muted">
          Mercado secundario de fracciones RWA. Compra y vende tokens con otros inversores de la red.
        </p>
      </div>

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
                  {MOCK_ORDERS.map((order) => {
                    const discount = ((order.price - order.originalPrice) / order.originalPrice) * 100;
                    const isDiscount = discount < 0;

                    return (
                      <tr key={order.id} className="hover:bg-pn-surface-strong/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-pn-text">
                          {order.property}
                        </td>
                        <td className="px-6 py-4 text-pn-text-soft">
                          {order.tokens} Tokens
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-pn-gold">${order.price.toFixed(2)}</span>
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
                            disabled={isBuying === order.id}
                            className="px-4 py-1.5 bg-pn-surface-strong hover:bg-pn-gold hover:text-black border border-pn-border hover:border-pn-gold rounded-md text-pn-text text-xs font-medium transition-all"
                          >
                            {isBuying === order.id ? "Procesando..." : "Comprar"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Orden creada."); }}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-pn-text-muted">Bóveda (Propiedad)</label>
                <select className="w-full px-4 py-3 bg-pn-bg border border-pn-border rounded-lg focus:outline-none focus:ring-1 focus:ring-pn-gold text-pn-text transition-colors">
                  <option>San Bartolo (Disponible: 1250 tokens)</option>
                  <option>Resort Paracas (Disponible: 500 tokens)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-pn-text-muted">Cantidad a Vender</label>
                  <input type="number" required min="1" className="w-full px-4 py-3 bg-pn-bg border border-pn-border rounded-lg focus:outline-none focus:ring-1 focus:ring-pn-gold text-pn-text transition-colors" placeholder="Ej. 100" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-pn-text-muted">Precio por Token (USD)</label>
                  <input type="number" required min="0.01" step="0.01" className="w-full px-4 py-3 bg-pn-bg border border-pn-border rounded-lg focus:outline-none focus:ring-1 focus:ring-pn-gold text-pn-text transition-colors" placeholder="Ej. 8.50" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-pn-gold hover:bg-pn-gold/90 text-black font-semibold py-3 px-4 rounded-lg transition-all">
                  Publicar Oferta P2P
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
