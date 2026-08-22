"use client";

import { useState } from "react";

export default function ReserveButton({ listingId }: { listingId: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function reserve() {
    setBusy();
    try {
      const res = await fetch("/api/client/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo reservar");
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setState("idle");
    }
  }

  function setBusy() {
    setError(null);
    setState("busy");
  }

  if (state === "done") {
    return <p className="text-sm text-emerald-400">Reservado. El admin verá la operación.</p>;
  }

  return (
    <div>
      <button
        onClick={reserve}
        disabled={state === "busy"}
        className="mt-3 text-sm bg-[#c5a46d] text-black rounded-lg px-4 py-2 disabled:opacity-50"
      >
        {state === "busy" ? "Reservando…" : "Reservar"}
      </button>
      {error && <p className="text-xs text-red-300 mt-1">{error}</p>}
    </div>
  );
}
