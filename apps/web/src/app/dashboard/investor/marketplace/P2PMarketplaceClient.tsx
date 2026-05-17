"use client";

import { useState } from "react";
import { MissionCard } from "@/components/mission/MissionCard";
import { CommandButton } from "@/components/mission/CommandButton";
import { DataGrid, DataGridRow, DataGridCell } from "@/components/product/SharedComponents";
import { useRouter } from "next/navigation";

export function P2PMarketplaceClient({ 
  availableOrders, 
  myOrders, 
  balance, 
  kycStatus, 
  currentUserId,
  propertyId
}: { 
  availableOrders: any[]; 
  myOrders: any[]; 
  balance: any | null; 
  kycStatus: string; 
  currentUserId: string; 
  propertyId: string;
}) {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [sellQuantity, setSellQuantity] = useState(1);
  const [sellPrice, setSellPrice] = useState(8.40);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success'|'error' } | null>(null);
  const router = useRouter();

  const isKycApproved = kycStatus === "approved";
  const availableUsd = Number(balance?.available_usd || 0);
  const availableTokens = Number(balance?.available_tokens || 0);

  const handleCreateOrder = async () => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/demo/actions/p2p-sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sellerInvestorId: currentUserId, 
          propertyId,
          quantity: sellQuantity, 
          pricePerToken: sellPrice 
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Orden publicada exitosamente.", type: 'success' });
        setSellQuantity(1);
        router.refresh();
      } else {
        setMessage({ text: data.error, type: 'error' });
      }
    } catch {
      setMessage({ text: "Error de red local", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyOrder = async (orderId: string, quantityToBuy: number) => {
    if (!window.confirm("¿Confirmar la compra de estos tokens?")) return;
    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/demo/actions/p2p-buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          buyerInvestorId: currentUserId, 
          orderId,
          quantity: quantityToBuy
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Compra realizada exitosamente.", type: 'success' });
        router.refresh();
      } else {
        setMessage({ text: data.error, type: 'error' });
      }
    } catch {
      setMessage({ text: "Error de red local", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta orden y recuperar tus tokens?")) return;
    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/demo/actions/p2p-cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investorId: currentUserId, orderId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Orden cancelada exitosamente.", type: 'success' });
        router.refresh();
      } else {
        setMessage({ text: data.error, type: 'error' });
      }
    } catch {
      setMessage({ text: "Error de red local", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-pn-border">
        <button 
          onClick={() => setActiveTab("buy")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "buy" ? "border-pn-gold text-pn-text" : "border-transparent text-pn-text-muted hover:text-pn-text"}`}
        >
          Comprar Tokens
        </button>
        <button 
          onClick={() => setActiveTab("sell")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "sell" ? "border-pn-gold text-pn-text" : "border-transparent text-pn-text-muted hover:text-pn-text"}`}
        >
          Vender Tokens
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-pn-success/10 border border-pn-success text-pn-success' : 'bg-pn-danger/10 border border-pn-danger text-pn-danger'}`}>
          {message.text}
        </div>
      )}

      {/* COMPRAR TOKENS TAB */}
      {activeTab === "buy" && (
        <MissionCard title="Libro de Órdenes de Venta">
          <div className="mb-4 text-sm flex justify-between items-center bg-pn-surface-strong p-3 rounded-md border border-pn-border">
            <span>Tu balance USD disponible:</span>
            <span className="font-mono text-pn-gold">${availableUsd.toFixed(2)}</span>
          </div>

          {availableOrders.length === 0 ? (
            <div className="p-8 text-center text-pn-text-muted border border-pn-border border-dashed rounded-lg">
              No hay órdenes de venta activas de otros usuarios.
            </div>
          ) : (
            <DataGrid headers={["Vendedor", "Propiedad", "Cantidad", "Precio/Token", "Total", "Acción"]}>
              {availableOrders.map((o) => {
                const total = Number(o.quantity) * Number(o.price_per_token);
                const canAfford = availableUsd >= total;
                return (
                  <DataGridRow key={o.id}>
                    <DataGridCell>
                      {o.investor?.full_name || `${o.investor?.first_name ?? ''} ${o.investor?.last_name ?? ''}`.trim() || 'Anónimo'}
                    </DataGridCell>
                    <DataGridCell>{o.property?.name || 'PACHA Asset'}</DataGridCell>
                    <DataGridCell>{Number(o.quantity)}</DataGridCell>
                    <DataGridCell>${Number(o.price_per_token).toFixed(2)}</DataGridCell>
                    <DataGridCell>${total.toFixed(2)}</DataGridCell>
                    <DataGridCell>
                      <div className="relative group">
                        <CommandButton 
                          variant="primary" 
                          onClick={() => handleBuyOrder(o.id, Number(o.quantity))}
                          disabled={isSubmitting || !isKycApproved || !canAfford}
                        >
                          Comprar
                        </CommandButton>
                        {!canAfford && (
                          <div className="absolute hidden group-hover:block bottom-full mb-2 right-0 w-32 bg-pn-surface-strong text-pn-text-soft text-xs p-2 rounded shadow-lg border border-pn-border">
                            Deposita USD primero
                          </div>
                        )}
                      </div>
                    </DataGridCell>
                  </DataGridRow>
                );
              })}
            </DataGrid>
          )}
        </MissionCard>
      )}

      {/* VENDER TOKENS TAB */}
      {activeTab === "sell" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MissionCard title="Publicar Oferta de Venta">
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-pn-surface-strong p-3 rounded-md border border-pn-border text-sm">
                <span>Tokens Disponibles:</span>
                <span className="font-medium text-pn-text">{availableTokens} PACHA</span>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-pn-text-muted">Cantidad a vender</label>
                <input 
                  type="number" min={1} max={availableTokens}
                  value={sellQuantity} onChange={e => setSellQuantity(Number(e.target.value))}
                  className="w-full bg-pn-bg border border-pn-border rounded px-3 py-2 text-sm focus:outline-none focus:border-pn-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-pn-text-muted">Precio por PACHA (USD)</label>
                <input 
                  type="number" step="0.01" min={0.01} 
                  value={sellPrice} onChange={e => setSellPrice(Number(e.target.value))}
                  className="w-full bg-pn-bg border border-pn-border rounded px-3 py-2 text-sm focus:outline-none focus:border-pn-gold"
                />
              </div>

              <div className="pt-2">
                <p className="text-xs text-pn-text-soft mb-2">Total estimado: ${(sellQuantity * sellPrice).toFixed(2)} USD</p>
                <CommandButton 
                  variant="primary" 
                  fullWidth 
                  onClick={handleCreateOrder}
                  disabled={isSubmitting || !isKycApproved || sellQuantity <= 0 || sellPrice <= 0 || sellQuantity > availableTokens}
                >
                  {isSubmitting ? "Procesando..." : "Publicar Oferta"}
                </CommandButton>
                {!isKycApproved && <p className="text-xs text-pn-warning mt-2 text-center">KYC Pendiente</p>}
              </div>
            </div>
          </MissionCard>

          {/* MIS ÓRDENES */}
          <MissionCard title="Mis Órdenes Activas">
            {myOrders.length === 0 ? (
              <div className="p-8 text-center text-pn-text-muted border border-pn-border border-dashed rounded-lg">
                No tienes órdenes activas.
              </div>
            ) : (
              <div className="space-y-3">
                {myOrders.map(order => (
                  <div key={order.id} className="p-3 bg-pn-surface border border-pn-border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{Number(order.quantity)} PACHA</p>
                      <p className="text-xs text-pn-text-muted">a ${Number(order.price_per_token).toFixed(2)} c/u</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-pn-gold">${(Number(order.quantity) * Number(order.price_per_token)).toFixed(2)}</p>
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={isSubmitting}
                        className="text-xs text-pn-danger hover:underline mt-1"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MissionCard>
        </div>
      )}
    </div>
  );
}
