"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function ReservePay({ listingId, orderId, pay }: { listingId?: string; orderId?: string; pay?: boolean }) {
  const [msg, setMsg] = useState<string | null>(null);
  if (pay && orderId) {
    return (
      <form className="flex gap-2 mt-3" onSubmit={async (e) => {
        e.preventDefault();
        const amount = Number(new FormData(e.currentTarget).get("amount"));
        const res = await fetch("/api/client/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, amount }) });
        const data = await res.json();
        setMsg(res.ok ? "Pago informado." : data.error);
      }}>
        <input name="amount" type="number" min="1" required placeholder="USD" />
        <Button type="submit">Informar pago</Button>
        {msg && <span className="text-xs text-clay self-center">{msg}</span>}
      </form>
    );
  }
  return (
    <div className="mt-3">
      <Button onClick={async () => {
        const res = await fetch("/api/client/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listingId }) });
        const data = await res.json();
        setMsg(res.ok ? "Reservado." : data.error);
      }}>Reservar</Button>
      {msg && <p className="text-xs text-clay mt-2">{msg}</p>}
    </div>
  );
}
