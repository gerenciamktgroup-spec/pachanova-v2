"use client";

import { useState } from "react";

export default function ContributeForm({ code }: { code: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="flex gap-2 max-w-lg"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setMsg(null);
        const amount = Number(new FormData(e.currentTarget).get("amount"));
        const res = await fetch(`/api/projects/${code}/capital`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "contribute", amount }),
        });
        const data = await res.json();
        setBusy(false);
        if (!res.ok) {
          setMsg(data.error || "Error");
          return;
        }
        setMsg("Aporte registrado. El admin debe conciliarlo.");
        e.currentTarget.reset();
      }}
    >
      <input name="amount" type="number" min="1" required placeholder="USD" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
      <button disabled={busy} className="px-4 rounded-lg bg-[#c5a46d] text-black text-sm disabled:opacity-50">
        {busy ? "Enviando…" : "Aportar"}
      </button>
      {msg && <p className="text-xs text-[#c5a46d] w-full">{msg}</p>}
    </form>
  );
}
