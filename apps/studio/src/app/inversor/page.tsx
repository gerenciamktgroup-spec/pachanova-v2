import { db, core } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { Card, PageTitle } from "@/components/ui";
import Link from "next/link";
import { Contribute } from "./contribute";

export const dynamic = "force-dynamic";

export default async function InversorHome() {
  const session = await getSession();
  let mine: any[] = [];
  if (session) {
    const [profile] = await db.select().from(core.profiles).where(eq(core.profiles.email, session.email)).limit(1);
    if (profile) {
      mine = await db.select({ participation: core.participations, project: core.projects })
        .from(core.participations)
        .innerJoin(core.projects, eq(core.participations.projectId, core.projects.id))
        .where(eq(core.participations.investorId, profile.id));
    }
  }
  const open = await db.select().from(core.projects).where(eq(core.projects.roundStatus, "open"));

  return (
    <div>
      <PageTitle kicker="Inversor" title="Tus participaciones">
        Cofinanciás proyectos. El comprador usa el panel Cliente.
      </PageTitle>
      <h2 className="text-lg mb-3">Rondas abiertas</h2>
      <Contribute projects={open.map((p) => ({ code: p.code, name: p.name, type: p.type, location: p.location, raised: p.raisedCapital, target: p.targetCapital }))} />
      <h2 className="text-lg mt-10 mb-3">Ya aportaste</h2>
      <div className="space-y-3">
        {mine.map((r) => (
          <Card key={r.project.code}>
            <Link href={`/inversor/proyectos/${r.project.code}`}>
              <p className="text-xs text-mute">{r.project.code}</p>
              <h3 className="text-xl">{r.project.name}</h3>
              <p className="text-sm mt-2">Comprometido ${Number(r.participation.committedAmount).toLocaleString()} · pagado ${Number(r.participation.paidAmount).toLocaleString()}</p>
            </Link>
          </Card>
        ))}
        {mine.length === 0 && <p className="text-sm text-mute">Todavía no hay participaciones.</p>}
      </div>
    </div>
  );
}
