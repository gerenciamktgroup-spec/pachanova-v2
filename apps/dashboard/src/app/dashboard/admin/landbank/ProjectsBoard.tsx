"use client";

import { useCallback, useEffect, useState } from "react";

type Project = {
  id: string;
  code: string;
  name: string;
  type: string;
  status: string;
  location: string;
  thesis: string | null;
  targetCapital: string;
  raisedCapital: string;
  roundStatus: string;
};

const TYPE_LABEL: Record<string, string> = {
  landbanking: "Landbanking",
  building_sale: "Edificio en venta",
  building_rent: "Edificio en renta",
  other: "Otro",
};

export default function ProjectsBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/projects", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "No se pudieron cargar proyectos");
      return;
    }
    setProjects(data.projects || []);
    setError(null);
  }, []);

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, [load]);

  async function onCreate(formData: FormData) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.get("code"),
          name: formData.get("name"),
          type: formData.get("type"),
          location: formData.get("location"),
          targetCapital: formData.get("targetCapital"),
          thesis: formData.get("thesis"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <form action={onCreate} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 grid gap-3 md:grid-cols-2">
        <h3 className="md:col-span-2 text-sm uppercase tracking-widest text-[#c5a46d]">Nuevo proyecto</h3>
        <input name="code" required placeholder="Código (PNC-XXX)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <input name="name" required placeholder="Nombre" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <select name="type" required className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm">
          <option value="landbanking">Landbanking</option>
          <option value="building_sale">Edificio en venta</option>
          <option value="building_rent">Edificio en renta</option>
        </select>
        <input name="location" placeholder="Ubicación" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <input name="targetCapital" type="number" min="0" step="1000" placeholder="Meta de capital USD" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <input name="thesis" placeholder="Tesis (una línea)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm md:col-span-2" />
        <button disabled={saving} className="md:col-span-2 rounded-lg bg-[#c5a46d] text-black text-sm font-medium py-2 disabled:opacity-50">
          {saving ? "Guardando…" : "Crear proyecto"}
        </button>
      </form>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="grid gap-3">
        {projects.map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#c5a46d]">{p.code}</p>
                <h3 className="text-lg text-white">{p.name}</h3>
                <p className="text-sm text-white/50">{p.location || "Sin ubicación"}</p>
              </div>
              <div className="text-right text-xs text-white/60">
                <div>{TYPE_LABEL[p.type] || p.type}</div>
                <div className="mt-1">{p.status} · ronda {p.roundStatus}</div>
              </div>
            </div>
            {p.thesis && <p className="mt-3 text-sm text-white/70">{p.thesis}</p>}
            <p className="mt-3 text-sm text-white/80">
              Levantado ${Number(p.raisedCapital).toLocaleString()} / meta ${Number(p.targetCapital).toLocaleString()}
            </p>
          </div>
        ))}
        {projects.length === 0 && !error && (
          <p className="text-sm text-white/40">No hay proyectos. Creá el primero arriba.</p>
        )}
      </div>
    </div>
  );
}
