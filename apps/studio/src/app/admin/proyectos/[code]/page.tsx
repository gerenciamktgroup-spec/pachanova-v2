"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, Field, PageTitle } from "@/components/ui";

export default function ProyectoOps() {
  const { code } = useParams<{ code: string }>();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/projects/${code}`, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) setError(json.error);
    else setData(json);
  }, [code]);

  useEffect(() => { load(); }, [load]);

  async function post(path: string, body: unknown) {
    const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    await load();
  }
  async function patch(path: string, body: unknown) {
    const res = await fetch(path, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    await load();
  }

  if (!data) return <p className="text-mute">{error || "Cargando…"}</p>;
  const p = data.project;

  return (
    <div className="space-y-6">
      <Link href="/admin/proyectos" className="text-sm text-mute">← Proyectos</Link>
      <PageTitle kicker={p.code} title={p.name}>
        {p.location} · {p.type} · ronda {p.roundStatus}
      </PageTitle>
      {error && <p className="text-sm text-bad">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => patch(`/api/projects/${code}`, { roundStatus: "open", status: "funding" })}>Abrir ronda</Button>
        <Button variant="ghost" onClick={() => patch(`/api/projects/${code}`, { roundStatus: "paused" })}>Pausar</Button>
        <Button variant="ghost" onClick={() => patch(`/api/projects/${code}`, { roundStatus: "closed" })}>Cerrar ronda</Button>
        <span className="text-sm text-mute self-center">${Number(p.raisedCapital).toLocaleString()} / ${Number(p.targetCapital).toLocaleString()}</span>
      </div>

      <Card>
        <h2 className="text-lg mb-3">Data room</h2>
        <form className="grid md:grid-cols-3 gap-2 mb-4" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); post(`/api/projects/${code}/documents`, Object.fromEntries(f)).catch((err) => setError(err.message)); e.currentTarget.reset(); }}>
          <Field label="Título"><input name="title" required /></Field>
          <Field label="Categoría"><input name="category" placeholder="título, tasación…" /></Field>
          <Field label="URL"><input name="fileUrl" /></Field>
          <div className="md:col-span-3"><Button type="submit">Agregar documento</Button></div>
        </form>
        {data.documents.map((d: any) => <p key={d.id} className="text-sm py-1 border-t border-line">{d.title} · {d.category}</p>)}
      </Card>

      <Card>
        <h2 className="text-lg mb-3">Hitos</h2>
        <form className="flex gap-2 mb-3" onSubmit={(e) => { e.preventDefault(); post(`/api/projects/${code}/milestones`, { title: new FormData(e.currentTarget).get("title") }).catch((err) => setError(err.message)); e.currentTarget.reset(); }}>
          <input name="title" required placeholder="Compra de tierra, partida de obra…" />
          <Button type="submit">Agregar</Button>
        </form>
        {data.milestones.map((m: any) => (
          <div key={m.id} className="flex justify-between text-sm py-1 border-t border-line">
            <span>{m.title} · {m.status}</span>
            {m.status !== "done" && <button className="underline text-mute" onClick={() => patch(`/api/projects/${code}/milestones`, { id: m.id, status: "done" })}>Hecho</button>}
          </div>
        ))}
      </Card>

      <Card>
        <h2 className="text-lg mb-3">Aportes</h2>
        {data.capital.map((t: any) => (
          <div key={t.id} className="flex justify-between text-sm py-1 border-t border-line">
            <span>${Number(t.amount).toLocaleString()} · {t.status}</span>
            {t.status === "pending" && <button className="underline text-clay" onClick={() => post(`/api/projects/${code}/capital`, { action: "reconcile", transactionId: t.id }).catch((err) => setError(err.message))}>Conciliar</button>}
          </div>
        ))}
      </Card>

      <Card>
        <h2 className="text-lg mb-3">Ofertas al cliente</h2>
        <form className="grid md:grid-cols-4 gap-2 mb-3" onSubmit={(e) => { e.preventDefault(); post(`/api/projects/${code}/listings`, Object.fromEntries(new FormData(e.currentTarget))).catch((err) => setError(err.message)); e.currentTarget.reset(); }}>
          <input name="title" required placeholder="Título" />
          <select name="kind"><option value="lot">Lote</option><option value="unit_sale">Unidad</option><option value="rental">Alquiler</option></select>
          <input name="unitCode" placeholder="Código" />
          <input name="price" type="number" placeholder="USD" />
          <div className="md:col-span-4"><Button type="submit">Publicar</Button></div>
        </form>
        {data.listings.map((l: any) => <p key={l.id} className="text-sm py-1 border-t border-line">{l.title} · ${Number(l.price).toLocaleString()} · {l.status}</p>)}
      </Card>

      <Card>
        <h2 className="text-lg mb-3">Clientes</h2>
        {(data.orders || []).map((row: any) => <p key={row.order.id} className="text-sm">{row.listing.title} · {row.order.status}</p>)}
        {(data.payments || []).map((pay: any) => (
          <div key={pay.id} className="flex justify-between text-sm py-1 border-t border-line">
            <span>Pago ${Number(pay.amount).toLocaleString()} · {pay.status}</span>
            {pay.status === "pending" && <button className="underline text-clay" onClick={() => post("/api/client/payments", { action: "reconcile", paymentId: pay.id }).catch((err) => setError(err.message))}>Conciliar</button>}
          </div>
        ))}
      </Card>
    </div>
  );
}
