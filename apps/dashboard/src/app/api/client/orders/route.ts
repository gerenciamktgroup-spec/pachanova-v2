import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionUser();
    const email = session?.email || "cliente@pachanova.local";
    const [client] = await db.select().from(core.profiles).where(eq(core.profiles.email, email)).limit(1);
    if (!client) return NextResponse.json({ orders: [] });

    const orders = await db
      .select({
        order: core.clientOrders,
        listing: core.listings,
      })
      .from(core.clientOrders)
      .innerJoin(core.listings, eq(core.clientOrders.listingId, core.listings.id))
      .where(eq(core.clientOrders.clientId, client.id));

    return NextResponse.json({ orders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (session && session.role !== "client" && session.role !== "admin") {
      return NextResponse.json({ error: "Solo cliente" }, { status: 403 });
    }
    const email = session?.email || "cliente@pachanova.local";
    const body = await req.json();
    if (!body.listingId) return NextResponse.json({ error: "listingId obligatorio" }, { status: 400 });

    const [client] = await db.select().from(core.profiles).where(eq(core.profiles.email, email)).limit(1);
    if (!client) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

    const [listing] = await db.select().from(core.listings).where(eq(core.listings.id, body.listingId)).limit(1);
    if (!listing) return NextResponse.json({ error: "Oferta no encontrada" }, { status: 404 });
    if (listing.status !== "published") {
      return NextResponse.json({ error: "La oferta no está disponible" }, { status: 409 });
    }

    const [order] = await db
      .insert(core.clientOrders)
      .values({
        listingId: listing.id,
        clientId: client.id,
        status: "reserved",
        notes: body.notes ? String(body.notes) : null,
      })
      .returning();

    await db
      .update(core.listings)
      .set({ status: "reserved", updatedAt: new Date() })
      .where(eq(core.listings.id, listing.id));

    await db.insert(core.auditEvents).values({
      actorId: session?.id,
      action: "order.reserve",
      entityType: "client_order",
      entityId: order.id,
      payload: { listingId: listing.id },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
