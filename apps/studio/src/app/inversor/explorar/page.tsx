import { db, core } from "@/lib/db";
import Link from "next/link";
import { Card, PageTitle } from "@/components/ui";
import { TYPE_LABEL, STATUS_LABEL, money, coverOf } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function Explorar() {
  const projects = await db.select().from(core.projects);
  return (
    <div>
      <PageTitle kicker="Inversor" title="Explorar proyectos">
        Landbanking, edificios en venta y renta. Aportás capital, no comprás la unidad.
      </PageTitle>
      <div className="space-y-4">
        {projects.map((p) => {
          const cover = coverOf(p.metadata);
          return (
            <Link key={p.id} href={`/inversor/proyectos/${p.code}`}>
              <Card className="p-0 overflow-hidden hover:border-ink">
                {cover && <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${cover})` }} />}
                <div className="p-6">
                  <p className="text-xs text-mute">{p.code} · {TYPE_LABEL[p.type]} · {STATUS_LABEL[p.roundStatus]}</p>
                  <h2 className="text-xl mt-1">{p.name}</h2>
                  <p className="text-sm text-mute mt-1">{p.location}</p>
                  <p className="text-sm mt-3">{p.thesis}</p>
                  <p className="text-sm mt-3">{money(p.raisedCapital)} / {money(p.targetCapital)}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
