"use client";

import { useState } from "react";

export default function PayButton({ orderId }: { orderId: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="flex gap-2 mt-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const amount = Number(new FormData(e.currentTarget).get("amount"));
        const res = await fetch("/api/client/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, amount, kind: "down_payment" }),
        });
        const data = await res.json();
        setBusy(false);
        if (!res.ok) {
          setMsg(data.error || "Error");
          return;
        }
        setMsg("Pago informado. Pendiente de conciliación.");
        e.currentTarget.reset();
      }}
    >
      <input name="amount" type="number" min="1" required placeholder="USD" className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-32" />
      <button disabled={busy} className="text-xs px-3 rounded-lg bg-[#c5a46d] text-black disabled:opacity-50">
        Informar pago
      </button>
      {msg && <span className="text-xs text-[#c5a46d]">{msg}</span>}
    </form>
  );
}
