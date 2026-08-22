import { db, core } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { Card, PageTitle } from "@/components/ui";
import Link from "next/link";
import { money, TYPE_LABEL, STATUS_LABEL } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const projects = await db.select().from(core.projects);
  const pendingCapital = await db.select().from(core.capitalTransactions).where(eq(core.capitalTransactions.status, "pending"));
  const pendingKyc = await db.select().from(core.kycFiles).where(eq(core.kycFiles.status, "pending"));
  const events = await db.select().from(core.auditEvents).orderBy(desc(core.auditEvents.createdAt)).limit(6);
  const raised = projects.reduce((s, p) => s + Number(p.raisedCapital), 0);
  const target = projects.reduce((s, p) => s + Number(p.targetCapital), 0);

  return (
    <div>
      <PageTitle kicker="Administración" title="Hoy">
        Tres proyectos en portafolio. Lo pendiente está abajo.
      </PageTitle>
      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        <Card>
          <p className="text-xs text-mute">Proyectos</p>
          <p className="text-3xl mt-1">{projects.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-mute">Capital levantado</p>
          <p className="text-3xl mt-1">{money(raised)}</p>
          <p className="text-xs text-mute mt-1">Meta {money(target)}</p>
        </Card>
        <Card>
          <p className="text-xs text-mute">Por atender</p>
          <p className="text-3xl mt-1">{pendingCapital.length + pendingKyc.length}</p>
          <p className="text-xs text-mute mt-1">{pendingCapital.length} aportes · {pendingKyc.length} KYC</p>
        </Card>
      </div>

      <h2 className="text-lg mb-3">Portafolio</h2>
      <div className="space-y-3 mb-10">
        {projects.map((p) => (
          <Link key={p.id} href={`/admin/proyectos/${p.code}`}>
            <Card className="hover:border-ink">
              <p className="text-xs text-mute">{p.code} · {TYPE_LABEL[p.type]} · {STATUS_LABEL[p.roundStatus] || p.roundStatus}</p>
              <h3 className="text-xl mt-1">{p.name}</h3>
              <p className="text-sm text-mute">{p.location}</p>
              <p className="text-sm mt-2">{money(p.raisedCapital)} / {money(p.targetCapital)}</p>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="text-lg mb-3">Actividad reciente</h2>
      <div className="space-y-2">
        {events.map((e) => (
          <p key={e.id} className="text-sm border-t border-line py-2 flex justify-between">
            <span>{e.action}</span>
            <span className="text-mute text-xs">{e.createdAt.toISOString().slice(0, 16).replace("T", " ")}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
