import { notFound } from "next/navigation";
import { projectBundle } from "@/lib/projects";
import { PageTitle, Card } from "@/components/ui";
import { Contribute } from "../../contribute";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InversorProyecto({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const bundle = await projectBundle(code);
  if (!bundle) notFound();
  const docs = bundle.documents.filter((d) => d.visibility === "investor" || d.visibility === "public");
  const p = bundle.project;
  return (
    <div>
      <Link href="/inversor" className="text-sm text-mute">← Participaciones</Link>
      <PageTitle kicker={p.code} title={p.name}>{p.thesis}</PageTitle>
      {p.roundStatus === "open" && (
        <Contribute projects={[{ code: p.code, name: p.name, type: p.type, location: p.location, raised: p.raisedCapital, target: p.targetCapital }]} />
      )}
      <Card className="mt-8">
        <h2 className="text-lg mb-3">Documentos</h2>
        {docs.length === 0 && <p className="text-sm text-mute">Aún no hay documentos visibles.</p>}
        {docs.map((d) => <p key={d.id} className="text-sm py-1 border-t border-line">{d.title}</p>)}
      </Card>
      <Card className="mt-4">
        <h2 className="text-lg mb-3">Hitos</h2>
        {bundle.milestones.map((m) => <p key={m.id} className="text-sm py-1 border-t border-line">{m.title} · {m.status}</p>)}
      </Card>
    </div>
  );
}
