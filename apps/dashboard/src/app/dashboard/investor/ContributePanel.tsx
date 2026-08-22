"use client";

import { useEffect, useState } from "react";

type Project = {
  code: string;
  name: string;
  type: string;
  location: string;
  roundStatus: string;
  targetCapital: string;
  raisedCapital: string;
};

export default function ContributePanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setProjects((d.projects || []).filter((p: Project) => p.roundStatus === "open")))
      .catch((e) => setMessage(String(e)));
  }, []);

  async function contribute(code: string, form: HTMLFormElement) {
    setBusy(code);
    setMessage(null);
    try {
      const amount = Number(new FormData(form).get("amount"));
      const res = await fetch(`/api/projects/${code}/capital`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "contribute", amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo aportar");
      setMessage(`Aporte de ${amount} registrado en ${code}. Queda pendiente de conciliación del admin.`);
      form.reset();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(null);
    }
  }

  if (projects.length === 0) {
    return <p className="text-sm text-white/40">No hay rondas abiertas para cofinanciar.</p>;
  }

  return (
    <div className="space-y-3">
      {message && <p className="text-sm text-[#c5a46d]">{message}</p>}
      {projects.map((p) => (
        <form
          key={p.code}
          className="rounded-2xl border border-white/10 p-5 text-white space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            contribute(p.code, e.currentTarget);
          }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#c5a46d]">{p.code} · {p.type}</p>
            <h3 className="text-lg">{p.name}</h3>
            <p className="text-sm text-white/50">{p.location}</p>
            <p className="text-xs text-white/40 mt-1">
              ${Number(p.raisedCapital).toLocaleString()} / ${Number(p.targetCapital).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <input name="amount" type="number" min="1" required placeholder="USD a aportar" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
            <button disabled={busy === p.code} className="px-4 rounded-lg bg-[#c5a46d] text-black text-sm disabled:opacity-50">
              {busy === p.code ? "Enviando…" : "Aportar"}
            </button>
          </div>
        </form>
      ))}
    </div>
  );
}
