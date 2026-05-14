"use client";

import { useState } from "react";
import { MissionCard, CommandButton } from "@/components/mission";
import { DataGrid, DataGridRow, DataGridCell } from "@/components/product/SharedComponents";
import { useRouter } from "next/navigation";

export function P2PMarketplaceClient({ orders, balance, kycStatus, currentUserId }: { orders: Record<string, unknown>[]; balance: Record<string, unknown> | null; kycStatus: string; currentUserId: string; }) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(8.40);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleCreateOrder = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/demo/actions/p2p/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerInvestorId: currentUserId, quantity, pricePerToken: price })
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
        body: JSON.stringify({ buyerInvestorId: currentUserId, orderId })
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
              <label className="text-sm text-pn-text-muted">Cantidad a vender</label>
              <input 
                type="number" min={1} 
                value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                className="w-full bg-pn-bg border border-pn-border rounded px-3 py-2 text-sm focus:outline-none focus:border-pn-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-pn-text-muted">Precio por PACHA (USD)</label>
              <input 
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
            {message && <p className="text-xs text-pn-gold">{message}</p>}
          </div>
        </MissionCard>
      </div>

      {/* Order Book */}
      <div className="md:col-span-2">
        <MissionCard title="Libro de Órdenes Abiertas">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-pn-text-muted border border-pn-border border-dashed rounded-lg">
              No hay órdenes de venta activas en el mercado.
            </div>
          ) : (
            <DataGrid headers={["Vendedor", "Cantidad", "Precio/Token", "Total USD", "Acción"]}>
              {orders.map((o) => (
                <DataGridRow key={o.id as string}>
                  <DataGridCell><span className="text-xs truncate max-w-[80px] block">{(o.sellerInvestorId as string).split("-")[0]}...</span></DataGridCell>
                  <DataGridCell>{String(o.quantity)} PACHA</DataGridCell>
                  <DataGridCell>${String(o.pricePerToken)}</DataGridCell>
                  <DataGridCell>${String(o.totalAmount)}</DataGridCell>
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
