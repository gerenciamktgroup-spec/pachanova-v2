"use client";

import { useState } from "react";
import Link from "next/link";
import { MissionCard, CommandButton } from "@/components/mission";
import { DataGrid, DataGridRow, DataGridCell } from "@/components/product/SharedComponents";
import { useRouter } from "next/navigation";

export function P2PMarketplaceClient({ orders, balance, kycStatus, currentUserId, pncCode }: { orders: Record<string, unknown>[]; balance: Record<string, unknown> | null; kycStatus: string; currentUserId: string; pncCode?: string; }) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(8.40);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Fase 6: P2P landbank ties - prefill from 5PNC hologram / E2E flow if provided (rich fallback to generic)
  const effectivePnc = pncCode || "";

  const handleCreateOrder = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/demo/actions/p2p/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, pricePerToken: price, pncCode: effectivePnc || undefined })
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Orden publicada exitosamente.");
        router.refresh();
      } else {
        setMessage(data.error);
      }
    } catch {
      setMessage("Error de red");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyOrder = async (orderId: string) => {
    setIsSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/demo/actions/p2p/buy-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Compra realizada exitosamente.");
        router.refresh();
      } else {
        setMessage(data.error);
      }
    } catch {
      setMessage("Error de red");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isKycApproved = kycStatus === "approved";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Create Order Form */}
      <div className="md:col-span-1">
        <MissionCard title="Publicar Orden de Venta">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-pn-text-soft mb-1">Tokens Disponibles</p>
              <p className="font-medium text-pn-text">{String(balance?.availableTokens || 0)} PACHA</p>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="p2p-quantity" className="text-sm text-pn-text-muted">Cantidad a vender</label>
              <input 
                id="p2p-quantity"
                type="number" min={1} 
                value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                className="w-full bg-pn-bg border border-pn-border rounded px-3 py-2 text-sm focus:outline-none focus:border-pn-gold"
              />
            </div>

            {/* Fase 6 P2P on 5PNC tie */}
            {effectivePnc && (
              <div className="p-2 bg-pn-gold/10 border border-pn-gold/30 rounded text-xs">
                P2P Order tied to PNC: <span className="font-mono font-semibold text-pn-gold">{effectivePnc}</span> (from Landbank Hologram E2E)
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="p2p-price" className="text-sm text-pn-text-muted">Precio por PACHA (USD)</label>
              <input 
                id="p2p-price"
                type="number" step="0.01" min={0.01} 
                value={price} onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-pn-bg border border-pn-border rounded px-3 py-2 text-sm focus:outline-none focus:border-pn-gold"
              />
            </div>

            <div className="pt-2">
              <p className="text-xs text-pn-text-soft mb-2">Total a recibir: ${(quantity * price).toFixed(2)} USD</p>
              <CommandButton 
                variant="primary" 
                fullWidth 
                onClick={handleCreateOrder}
                disabled={isSubmitting || !isKycApproved || quantity <= 0 || price <= 0}
              >
                {isSubmitting ? "Procesando..." : "Publicar Oferta"}
              </CommandButton>
              {!isKycApproved && <p className="text-xs text-pn-warning mt-2">KYC Pendiente</p>}
            </div>
            {message && <p className="text-xs text-pn-gold" aria-live="polite">{message}</p>}
          </div>
        </MissionCard>
      </div>

      {/* Order Book */}
      <div className="md:col-span-2">
        <MissionCard title="Libro de Órdenes Abiertas (Marketplace Orderbook + more PNC ties + orq Fase refs)">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-pn-text-muted border border-pn-border border-dashed rounded-lg">
              No hay órdenes de venta activas en el mercado.
            </div>
          ) : (
            <DataGrid headers={["Vendedor", "Cantidad", "Precio/Token", "Total USD", "PNC (E2E tie)", "Acción"]}>
              {orders.map((o) => (
                <DataGridRow key={o.id as string}>
                  <DataGridCell><span className="text-xs truncate max-w-[80px] block">{(o.sellerInvestorId as string).split("-")[0]}...</span></DataGridCell>
                  <DataGridCell>{String(o.quantity)} PACHA</DataGridCell>
                  <DataGridCell>${String(o.pricePerToken)}</DataGridCell>
                  <DataGridCell>${String(o.totalAmount)}</DataGridCell>
                  <DataGridCell>
                    <span className="font-mono text-[10px] text-pn-gold/80">{effectivePnc || "5PNC"}</span>
                    <span className="block text-[9px] text-pn-text-muted">vínculo landbank • referencia ORQ F16/51</span>
                    <Link href="/demo/showcase#phase4-hologram-landbank" className="text-[8px] underline text-pn-gold/60">ver avances per-PNC</Link>
                  </DataGridCell>
                  <DataGridCell>
                    {o.sellerInvestorId === currentUserId ? (
                      <span className="text-xs text-pn-text-soft italic">Mi orden</span>
                    ) : (
                      <CommandButton 
                        variant="outline" 
                        onClick={() => handleBuyOrder(o.id as string)}
                        disabled={isSubmitting || !isKycApproved}
                      >
                        Comprar
                      </CommandButton>
                    )}
                  </DataGridCell>
                </DataGridRow>
              ))}
            </DataGrid>
          )}
        </MissionCard>
      </div>
    </div>
  );
}
