import { db, core } from "@/lib/db";
import Link from "next/link";
import { TYPE_LABEL, STATUS_LABEL, money, coverOf } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function Catalogo() {
  const projects = await db.select().from(core.projects);
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <Link href="/" className="serif text-xl">PachaNova</Link>
        <Link href="/login" className="text-sm border border-line rounded-full px-4 py-1.5">Entrar</Link>
      </header>
      <main className="max-w-5xl mx-auto px-6 pb-24">
        <p className="text-xs uppercase tracking-[0.2em] text-mute mb-3">Portafolio</p>
        <h1 className="text-4xl mb-8">Tres giros, mismos roles.</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => {
            const cover = coverOf(p.metadata);
            return (
              <Link key={p.id} href={`/proyectos/${p.code}`} className="block border border-line rounded-2xl overflow-hidden bg-card hover:border-ink">
                {cover && (
                  <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${cover})` }} />
                )}
                <div className="p-5">
                  <p className="text-xs text-mute">{TYPE_LABEL[p.type]} · {STATUS_LABEL[p.roundStatus] || p.roundStatus}</p>
                  <h2 className="text-xl mt-1">{p.name}</h2>
                  <p className="text-sm text-mute mt-1">{p.location}</p>
                  <p className="text-sm mt-3">{money(p.raisedCapital)} levantados</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
