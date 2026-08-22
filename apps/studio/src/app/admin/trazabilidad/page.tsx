import { db, core } from "@/lib/db";
import { desc } from "drizzle-orm";
import { Card, PageTitle } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Trazabilidad() {
  const events = await db.select().from(core.auditEvents).orderBy(desc(core.auditEvents.createdAt)).limit(80);
  return (
    <div>
      <PageTitle kicker="Administración" title="Trazabilidad">Quién hizo qué, y cuándo.</PageTitle>
      <div className="space-y-2">
        {events.map((e) => (
          <Card key={e.id} className="py-4">
            <div className="flex justify-between text-sm">
              <span>{e.action}</span>
              <span className="text-mute text-xs">{e.createdAt.toISOString().slice(0, 16).replace("T", " ")}</span>
            </div>
            <p className="text-xs text-mute mt-1">{e.entityType}</p>
          </Card>
        ))}
        {events.length === 0 && <p className="text-mute text-sm">Todavía no hay eventos.</p>}
      </div>
    </div>
  );
}
