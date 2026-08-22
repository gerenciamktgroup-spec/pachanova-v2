"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, Field, PageTitle } from "@/components/ui";

type Project = {
  code: string;
  name: string;
  type: string;
  location: string;
  status: string;
  roundStatus: string;
  targetCapital: string;
  raisedCapital: string;
};

const TYPES: Record<string, string> = {
  landbanking: "Landbanking",
  building_sale: "Edificio en venta",
  building_rent: "Edificio en renta",
};

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/projects", { cache: "no-store" });
    const data = await res.json();
    setProjects(data.projects || []);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  return (
    <div>
      <PageTitle kicker="Administración" title="Proyectos">
        Un proyecto, un tipo, un ciclo. Sin tokens.
      </PageTitle>

      <Card className="mb-8">
        <form
          className="grid md:grid-cols-2 gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const res = await fetch("/api/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(Object.fromEntries(f)),
            });
            const data = await res.json();
            if (!res.ok) return setError(data.error);
            e.currentTarget.reset();
            await load();
          }}
        >
          <Field label="Código"><input name="code" required placeholder="PNC-XXX" /></Field>
          <Field label="Nombre"><input name="name" required /></Field>
          <Field label="Tipo">
            <select name="type">
              <option value="landbanking">Landbanking</option>
              <option value="building_sale">Edificio en venta</option>
              <option value="building_rent">Edificio en renta</option>
            </select>
          </Field>
          <Field label="Ubicación"><input name="location" /></Field>
          <Field label="Meta de capital (USD)"><input name="targetCapital" type="number" min="0" /></Field>
          <Field label="Tesis"><input name="thesis" /></Field>
          <div className="md:col-span-2"><Button type="submit">Crear proyecto</Button></div>
        </form>
        {error && <p className="text-sm text-bad mt-3">{error}</p>}
      </Card>

      <div className="space-y-3">
        {projects.map((p) => (
          <Link key={p.code} href={`/admin/proyectos/${p.code}`} className="block">
            <Card className="hover:border-ink transition-colors">
              <p className="text-xs text-mute">{p.code} · {TYPES[p.type] || p.type}</p>
              <h2 className="text-xl mt-1">{p.name}</h2>
              <p className="text-sm text-mute mt-1">{p.location || "Sin ubicación"} · ronda {p.roundStatus}</p>
              <p className="text-sm mt-3">${Number(p.raisedCapital).toLocaleString()} / ${Number(p.targetCapital).toLocaleString()}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
