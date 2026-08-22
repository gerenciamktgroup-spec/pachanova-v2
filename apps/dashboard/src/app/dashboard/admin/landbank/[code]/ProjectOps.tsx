"use client";

import { useCallback, useEffect, useState } from "react";

type Bundle = {
  project: {
    code: string;
    name: string;
    type: string;
    status: string;
    roundStatus: string;
    location: string;
    thesis: string | null;
    targetCapital: string;
    raisedCapital: string;
  };
  documents: Array<{ id: string; title: string; category: string; fileUrl: string; visibility: string }>;
  milestones: Array<{ id: string; title: string; status: string; description: string | null }>;
  participations: Array<{
    participation: { id: string; committedAmount: string; paidAmount: string; status: string };
    investor: { email: string; fullName: string };
  }>;
  listings: Array<{ id: string; title: string; kind: string; price: string; status: string; unitCode: string | null }>;
  capital: Array<{ id: string; amount: string; status: string; kind: string; notes: string | null }>;
};

export default function ProjectOps({ code }: { code: string }) {
  const [data, setData] = useState<Bundle | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/projects/${code}`, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Error");
      return;
    }
    setData(json);
    setError(null);
  }, [code]);

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, [load]);

  async function post(path: string, body: unknown) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error");
    await load();
  }

  async function patch(path: string, body: unknown) {
    const res = await fetch(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error");
    await load();
  }

  if (!data) {
    return <p className="text-white/50">{error || "Cargando…"}</p>;
  }

  const p = data.project;

  return (
    <div className="space-y-8 text-white">
      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-1.5 text-xs border border-white/15 rounded-lg" onClick={() => patch(`/api/projects/${code}`, { roundStatus: "open", status: "funding" }).catch((e) => setError(e.message))}>
          Abrir ronda
        </button>
        <button className="px-3 py-1.5 text-xs border border-white/15 rounded-lg" onClick={() => patch(`/api/projects/${code}`, { roundStatus: "paused" }).catch((e) => setError(e.message))}>
          Pausar ronda
        </button>
        <button className="px-3 py-1.5 text-xs border border-white/15 rounded-lg" onClick={() => patch(`/api/projects/${code}`, { roundStatus: "closed" }).catch((e) => setError(e.message))}>
          Cerrar ronda
        </button>
        <span className="text-xs text-white/40 self-center">
          {p.status} · ronda {p.roundStatus} · ${Number(p.raisedCapital).toLocaleString()} / ${Number(p.targetCapital).toLocaleString()}
        </span>
      </div>

      <section className="rounded-2xl border border-white/10 p-5 space-y-3">
        <h3 className="text-sm uppercase tracking-widest text-[#c5a46d]">Data room</h3>
        <form
          className="grid md:grid-cols-4 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            post(`/api/projects/${code}/documents`, {
              title: f.get("title"),
              category: f.get("category"),
              fileUrl: f.get("fileUrl"),
              visibility: f.get("visibility"),
            }).catch((err) => setError(err.message));
            e.currentTarget.reset();
          }}
        >
          <input name="title" required placeholder="Título" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <input name="category" placeholder="categoría (título, tasación, plano)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <input name="fileUrl" placeholder="URL o ruta" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <select name="visibility" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm">
            <option value="investor">Inversor</option>
            <option value="admin">Solo admin</option>
            <option value="client">Cliente</option>
          </select>
          <button className="md:col-span-4 text-sm bg-[#c5a46d] text-black rounded-lg py-2">Cargar documento</button>
        </form>
        {data.documents.map((d) => (
          <div key={d.id} className="text-sm text-white/70 flex justify-between gap-2">
            <span>{d.title} · {d.category}</span>
            <span className="text-white/35">{d.visibility}</span>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 p-5 space-y-3">
        <h3 className="text-sm uppercase tracking-widest text-[#c5a46d]">Hitos</h3>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            post(`/api/projects/${code}/milestones`, { title: f.get("title") }).catch((err) => setError(err.message));
            e.currentTarget.reset();
          }}
        >
          <input name="title" required placeholder="Ej. Compra de tierra" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <button className="text-sm bg-[#c5a46d] text-black rounded-lg px-4">Agregar</button>
        </form>
        {data.milestones.map((m) => (
          <div key={m.id} className="flex items-center justify-between text-sm">
            <span>{m.title} · {m.status}</span>
            {m.status !== "done" && (
              <button className="text-xs underline text-white/60" onClick={() => patch(`/api/projects/${code}/milestones`, { id: m.id, status: "done" }).catch((err) => setError(err.message))}>
                Marcar hecho
              </button>
            )}
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 p-5 space-y-3">
        <h3 className="text-sm uppercase tracking-widest text-[#c5a46d]">Aportes</h3>
        {data.capital.map((t) => (
          <div key={t.id} className="flex items-center justify-between text-sm">
            <span>{t.kind} ${Number(t.amount).toLocaleString()} · {t.status} {t.notes ? `· ${t.notes}` : ""}</span>
            {t.status === "pending" && (
              <button className="text-xs underline text-[#c5a46d]" onClick={() => post(`/api/projects/${code}/capital`, { action: "reconcile", transactionId: t.id }).catch((err) => setError(err.message))}>
                Conciliar
              </button>
            )}
          </div>
        ))}
        {data.participations.map((row) => (
          <p key={row.participation.id} className="text-xs text-white/45">
            {row.investor.fullName || row.investor.email}: comprometido ${Number(row.participation.committedAmount).toLocaleString()} / pagado ${Number(row.participation.paidAmount).toLocaleString()}
          </p>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 p-5 space-y-3">
        <h3 className="text-sm uppercase tracking-widest text-[#c5a46d]">Ofertas al cliente</h3>
        <form
          className="grid md:grid-cols-5 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            post(`/api/projects/${code}/listings`, {
              title: f.get("title"),
              kind: f.get("kind"),
              unitCode: f.get("unitCode"),
              price: f.get("price"),
              publish: true,
            }).catch((err) => setError(err.message));
            e.currentTarget.reset();
          }}
        >
          <input name="title" required placeholder="Título" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <select name="kind" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm">
            <option value="lot">Lote</option>
            <option value="unit_sale">Unidad venta</option>
            <option value="rental">Alquiler</option>
          </select>
          <input name="unitCode" placeholder="Código" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <input name="price" type="number" min="0" placeholder="Precio USD" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <button className="text-sm bg-[#c5a46d] text-black rounded-lg">Publicar</button>
        </form>
        {data.listings.map((l) => (
          <div key={l.id} className="flex justify-between text-sm text-white/70">
            <span>{l.title} · {l.kind} · {l.unitCode || "—"}</span>
            <span>${Number(l.price).toLocaleString()} · {l.status}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
