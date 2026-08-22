import { RouteBreadcrumbs } from "@/components/mission";
import { db, core } from "@/server/db";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  let events: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    reason: string | null;
    createdAt: Date;
  }> = [];
  let error: string | null = null;

  try {
    events = await db
      .select()
      .from(core.auditEvents)
      .orderBy(desc(core.auditEvents.createdAt))
      .limit(100);
  } catch (e) {
    error = e instanceof Error ? e.message : "No se pudo leer auditoría";
  }

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[{ label: "Admin" }, { label: "Trazabilidad" }]} />
      <div className="bg-[#0a111f] text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">Trazabilidad</h2>
        <p className="text-sm text-white/50 mb-6">Quién hizo qué, sobre qué entidad. Sin hash chain ni tokens.</p>
        {error && <p className="text-sm text-amber-200">{error}</p>}
        <div className="space-y-2">
          {events.map((e) => (
            <div key={e.id} className="border border-white/10 rounded-lg px-4 py-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-[#c5a46d]">{e.action}</span>
                <span className="text-white/35 text-xs">{e.createdAt.toISOString()}</span>
              </div>
              <p className="text-white/60 mt-1">
                {e.entityType}
                {e.entityId ? ` · ${e.entityId.slice(0, 8)}` : ""}
                {e.reason ? ` · ${e.reason}` : ""}
              </p>
            </div>
          ))}
          {events.length === 0 && !error && (
            <p className="text-white/40 text-sm">Todavía no hay eventos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
