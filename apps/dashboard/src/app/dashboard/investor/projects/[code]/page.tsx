import { RouteBreadcrumbs } from "@/components/mission";
import { loadProjectBundle } from "@/lib/projects/load";
import { notFound } from "next/navigation";
import Link from "next/link";
import ContributeForm from "./ContributeForm";

export const dynamic = "force-dynamic";

export default async function InvestorProjectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const bundle = await loadProjectBundle(code);
  if (!bundle) notFound();

  const docs = bundle.documents.filter((d) => d.visibility === "investor" || d.visibility === "public");

  return (
    <div className="space-y-8 pb-16 text-white">
      <RouteBreadcrumbs items={[{ label: "Inversor", href: "/dashboard/investor" }, { label: bundle.project.code }]} />
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#c5a46d]">{bundle.project.type} · ronda {bundle.project.roundStatus}</p>
        <h1 className="text-3xl font-light mt-1">{bundle.project.name}</h1>
        <p className="text-white/50 mt-1">{bundle.project.location}</p>
        {bundle.project.thesis && <p className="mt-4 text-white/70 max-w-2xl">{bundle.project.thesis}</p>}
        <p className="mt-3 text-sm text-white/60">
          ${Number(bundle.project.raisedCapital).toLocaleString()} / ${Number(bundle.project.targetCapital).toLocaleString()}
        </p>
      </div>

      {bundle.project.roundStatus === "open" && <ContributeForm code={bundle.project.code} />}

      <section>
        <h2 className="text-sm uppercase tracking-widest text-[#c5a46d] mb-3">Data room</h2>
        {docs.length === 0 && <p className="text-sm text-white/40">Sin documentos visibles para inversores.</p>}
        <ul className="space-y-2 text-sm">
          {docs.map((d) => (
            <li key={d.id} className="border border-white/10 rounded-lg px-3 py-2 flex justify-between">
              <span>{d.title} · {d.category}</span>
              {d.fileUrl ? <a className="underline text-white/50" href={d.fileUrl}>abrir</a> : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-widest text-[#c5a46d] mb-3">Hitos</h2>
        {bundle.milestones.length === 0 && <p className="text-sm text-white/40">Sin hitos.</p>}
        <ul className="space-y-2 text-sm text-white/70">
          {bundle.milestones.map((m) => (
            <li key={m.id}>{m.title} · {m.status}</li>
          ))}
        </ul>
      </section>

      <Link href="/dashboard/investor" className="text-xs text-white/40 underline">← Participaciones</Link>
    </div>
  );
}
