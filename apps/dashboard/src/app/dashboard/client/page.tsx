import { RouteBreadcrumbs } from "@/components/mission";
import { db, core } from "@/server/db";
import { eq, or } from "drizzle-orm";
import ReserveButton from "./ReserveButton";
import PayButton from "./PayButton";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function ClientHomePage() {
  let listings: Array<{
    id: string;
    title: string;
    kind: string;
    price: string;
    currency: string;
    status: string;
    projectName: string;
    location: string;
  }> = [];
  let error: string | null = null;
  let orders: Array<{ id: string; status: string; title: string }> = [];

  try {
    const rows = await db
      .select({
        listing: core.listings,
        project: core.projects,
      })
      .from(core.listings)
      .innerJoin(core.projects, eq(core.listings.projectId, core.projects.id))
      .where(or(eq(core.listings.status, "published"), eq(core.listings.status, "reserved")));

    const session = await getSessionUser();
    if (session?.email) {
      const [client] = await db.select().from(core.profiles).where(eq(core.profiles.email, session.email)).limit(1);
      if (client) {
        const mine = await db
          .select({ order: core.clientOrders, listing: core.listings })
          .from(core.clientOrders)
          .innerJoin(core.listings, eq(core.clientOrders.listingId, core.listings.id))
          .where(eq(core.clientOrders.clientId, client.id));
        orders = mine.map((r) => ({ id: r.order.id, status: r.order.status, title: r.listing.title }));
      }
    }

    listings = rows.map((r) => ({
      id: r.listing.id,
      title: r.listing.title,
      kind: r.listing.kind,
      price: r.listing.price,
      currency: r.listing.currency,
      status: r.listing.status,
      projectName: r.project.name,
      location: r.project.location,
    }));
  } catch (e) {
    error = e instanceof Error ? e.message : "No se pudieron cargar ofertas";
  }

  return (
    <div className="space-y-8 pb-16">
      <RouteBreadcrumbs items={[{ label: "Dashboard" }, { label: "Cliente" }]} />
      <div className="rounded-3xl border border-white/10 bg-[#0a111f] p-8 text-white">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#c5a46d] mb-3">
          Rol cliente · comprador o arrendatario
        </p>
        <h1 className="text-3xl font-light tracking-tight mb-3">Tu operación inmobiliaria</h1>
        <p className="text-white/60 max-w-2xl leading-relaxed">
          Acá ves lotes, unidades o alquileres. No es el panel del inversor.
        </p>
        <a href="/dashboard/client/kyc" className="inline-block mt-4 text-sm underline text-white/60">Completar KYC</a>
      </div>

      {error && <p className="text-sm text-amber-200">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {listings.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-white">
            <p className="text-[10px] uppercase tracking-widest text-[#c5a46d]">{item.kind} · {item.status}</p>
            <h2 className="text-lg mt-1">{item.title}</h2>
            <p className="text-sm text-white/50">{item.projectName} · {item.location}</p>
            <p className="mt-3 text-white">
              {item.currency} {Number(item.price).toLocaleString()}
            </p>
            {item.status === "published" && <ReserveButton listingId={item.id} />}
          </div>
        ))}
        {listings.length === 0 && !error && (
          <p className="text-white/45 text-sm">No hay ofertas publicadas todavía.</p>
        )}
      </div>

      {orders.length > 0 && (
        <section>
          <h2 className="text-sm uppercase tracking-widest text-[#c5a46d] mb-3">Tus reservas</h2>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="border border-white/10 rounded-lg px-4 py-3">
                <p className="text-sm text-white/70">{o.title} · {o.status}</p>
                <PayButton orderId={o.id} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
