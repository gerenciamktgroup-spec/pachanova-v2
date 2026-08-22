import { RouteBreadcrumbs } from "@/components/mission";
import { db, core } from "@/server/db";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InvestorDashboardPage() {
  const session = await getSessionUser();
  const email = session?.email || "inversor@pachanova.local";

  let participations: Array<{
    amount: string;
    paid: string;
    pct: string;
    status: string;
    projectName: string;
    projectCode: string;
    projectType: string;
    location: string;
  }> = [];
  let error: string | null = null;

  try {
    const [profile] = await db
      .select()
      .from(core.profiles)
      .where(eq(core.profiles.email, email))
      .limit(1);

    if (profile) {
      const rows = await db
        .select({
          participation: core.participations,
          project: core.projects,
        })
        .from(core.participations)
        .innerJoin(core.projects, eq(core.participations.projectId, core.projects.id))
        .where(eq(core.participations.investorId, profile.id));

      participations = rows.map((r) => ({
        amount: r.participation.committedAmount,
        paid: r.participation.paidAmount,
        pct: r.participation.ownershipPct,
        status: r.participation.status,
        projectName: r.project.name,
        projectCode: r.project.code,
        projectType: r.project.type,
        location: r.project.location,
      }));
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "No se pudo leer participaciones";
  }

  return (
    <div className="space-y-8 pb-16">
      <RouteBreadcrumbs items={[{ label: "Dashboard" }, { label: "Inversor" }]} />
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#c5a46d]">Rol inversor</p>
        <h1 className="text-3xl font-light text-white mt-1">Tus participaciones</h1>
        <p className="text-white/55 mt-2 max-w-2xl">
          Cofinanciás proyectos. El comprador o arrendatario usa el panel Cliente.
        </p>
      </div>

      {error && <p className="text-sm text-amber-200">{error}</p>}

      <div className="grid gap-4">
        {participations.map((p) => (
          <div key={p.projectCode} className="rounded-2xl border border-white/10 p-6 text-white">
            <p className="text-[10px] uppercase tracking-widest text-[#c5a46d]">{p.projectCode} · {p.projectType}</p>
            <h2 className="text-xl mt-1">{p.projectName}</h2>
            <p className="text-sm text-white/50">{p.location}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-white/40 text-xs">Comprometido</div>
                <div>${Number(p.amount).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-white/40 text-xs">Pagado</div>
                <div>${Number(p.paid).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-white/40 text-xs">% económico</div>
                <div>{Number(p.pct).toLocaleString()}%</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/40">Estado: {p.status}</p>
          </div>
        ))}
        {participations.length === 0 && !error && (
          <p className="text-white/45 text-sm">Todavía no tenés participaciones en un proyecto.</p>
        )}
      </div>

      <div className="flex gap-3 text-sm">
        <Link href="/dashboard/investor/kyc" className="underline text-white/70">KYC</Link>
        <Link href="/dashboard/investor/learn" className="underline text-white/70">Cómo funciona</Link>
      </div>
    </div>
  );
}
