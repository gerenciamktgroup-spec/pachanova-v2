import { Suspense } from "react";
import { RouteBreadcrumbs, LoadingState } from "@/components/mission";
import ProjectsBoard from "./ProjectsBoard";
import { db, core } from "@/server/db";

export const dynamic = "force-dynamic";

async function ProjectStats() {
  try {
    const projects = await db.select().from(core.projects);
    const raised = projects.reduce((s, p) => s + Number(p.raisedCapital || 0), 0);
    const target = projects.reduce((s, p) => s + Number(p.targetCapital || 0), 0);
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider">Proyectos</p>
          <p className="text-2xl text-white mt-1">{projects.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider">Meta de capital</p>
          <p className="text-2xl text-white mt-1">${target.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider">Levantado</p>
          <p className="text-2xl text-white mt-1">${raised.toLocaleString()}</p>
        </div>
      </div>
    );
  } catch {
    return (
      <p className="text-sm text-amber-200/80 mb-4">
        No se pudo leer la base local. ¿Está corriendo `docker compose up -d db`?
      </p>
    );
  }
}

export default function LandbankAdminPage() {
  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[{ label: "Admin" }, { label: "Proyectos" }]} />
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <h2 className="text-2xl font-bold tracking-tight mb-1">Proyectos</h2>
        <p className="text-sm text-white/50 mb-6">
          Cofinanciamiento: landbanking, edificio en venta o edificio en renta. Sin tokens.
        </p>
        <Suspense fallback={<LoadingState message="Cargando cifras..." />}>
          <ProjectStats />
        </Suspense>
        <ProjectsBoard />
      </div>
    </div>
  );
}
