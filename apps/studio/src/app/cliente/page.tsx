import { db, core } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { Card, PageTitle } from "@/components/ui";
import { ReservePay } from "./actions-client";

export const dynamic = "force-dynamic";

export default async function ClienteHome() {
  const session = await getSession();
  const listings = await db.select({ listing: core.listings, project: core.projects })
    .from(core.listings).innerJoin(core.projects, eq(core.listings.projectId, core.projects.id))
    .where(or(eq(core.listings.status, "published"), eq(core.listings.status, "reserved")));

  let orders: any[] = [];
  if (session) {
    const [client] = await db.select().from(core.profiles).where(eq(core.profiles.email, session.email)).limit(1);
    if (client) {
      orders = await db.select({ order: core.clientOrders, listing: core.listings })
        .from(core.clientOrders).innerJoin(core.listings, eq(core.clientOrders.listingId, core.listings.id))
        .where(eq(core.clientOrders.clientId, client.id));
    }
  }

  return (
    <div>
      <PageTitle kicker="Cliente" title="Tu operación">Lotes, unidades y alquileres. No es el panel del inversor.</PageTitle>
      <div className="grid md:grid-cols-2 gap-4">
        {listings.map((r) => (
          <Card key={r.listing.id}>
            <p className="text-xs text-mute">{r.listing.kind} · {r.listing.status}</p>
            <h2 className="text-xl mt-1">{r.listing.title}</h2>
            <p className="text-sm text-mute">{r.project.name} · {r.project.location}</p>
            <p className="mt-2">${Number(r.listing.price).toLocaleString()}</p>
            {r.listing.status === "published" && <ReservePay listingId={r.listing.id} />}
          </Card>
        ))}
      </div>
      {orders.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg mb-3">Reservas</h2>
          {orders.map((o) => (
            <Card key={o.order.id} className="mb-3">
              <p>{o.listing.title} · {o.order.status}</p>
              <ReservePay orderId={o.order.id} pay />
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
