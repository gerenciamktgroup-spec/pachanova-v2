import { notFound } from "next/navigation";
import Link from "next/link";
import { projectBundle } from "@/lib/projects";
import { TYPE_LABEL, STATUS_LABEL, money, coverOf } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function PublicProject({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const bundle = await projectBundle(code);
  if (!bundle) notFound();
  const p = bundle.project;
  const cover = coverOf(p.metadata);
  const listings = bundle.listings.filter((l) => l.status === "published");

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <Link href="/proyectos" className="text-sm text-mute">← Portafolio</Link>
        <Link href="/login" className="text-sm border border-line rounded-full px-4 py-1.5">Entrar</Link>
      </header>
      {cover && <div className="h-56 md:h-72 bg-cover bg-center" style={{ backgroundImage: `url(${cover})` }} />}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-xs text-mute">{p.code} · {TYPE_LABEL[p.type]} · {STATUS_LABEL[p.roundStatus]}</p>
        <h1 className="text-4xl mt-2">{p.name}</h1>
        <p className="text-mute mt-2">{p.location}</p>
        <p className="mt-6 leading-relaxed">{p.thesis}</p>
        <p className="mt-4 text-sm">{money(p.raisedCapital)} / {money(p.targetCapital)}</p>

        <h2 className="text-xl mt-12 mb-3">Hitos</h2>
        <ul className="space-y-2">
          {bundle.milestones.map((m) => (
            <li key={m.id} className="text-sm flex justify-between border-t border-line py-2">
              <span>{m.title}</span>
              <span className="text-mute">{STATUS_LABEL[m.status] || m.status}</span>
            </li>
          ))}
        </ul>

        {listings.length > 0 && (
          <>
            <h2 className="text-xl mt-12 mb-3">Para el cliente</h2>
            <ul className="space-y-2">
              {listings.map((l) => (
                <li key={l.id} className="text-sm flex justify-between border-t border-line py-2">
                  <span>{l.title}</span>
                  <span>{money(l.price)}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-10 text-sm text-mute">
          Para aportar, entrá como inversor. Para reservar un lote o unidad, entrá como cliente.
        </p>
        <Link href="/login" className="inline-block mt-4 bg-clay text-white rounded-lg px-5 py-2.5 text-sm">Entrar</Link>
      </main>
    </div>
  );
}
