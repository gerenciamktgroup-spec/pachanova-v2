import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, isStaff } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session && session.role !== "client" && !isStaff(session.role)) {
    return NextResponse.json({ error: "Solo cliente" }, { status: 403 });
  }
  if (!session) return NextResponse.json({ error: "Sesión requerida" }, { status: 401 });
  const body = await req.json();
  const [client] = await db.select().from(core.profiles).where(eq(core.profiles.email, session.email)).limit(1);
  if (!client) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  const [listing] = await db.select().from(core.listings).where(eq(core.listings.id, body.listingId)).limit(1);
  if (!listing || listing.status !== "published") return NextResponse.json({ error: "Oferta no disponible" }, { status: 409 });
  const [order] = await db.insert(core.clientOrders).values({ listingId: listing.id, clientId: client.id, status: "reserved" }).returning();
  await db.update(core.listings).set({ status: "reserved", updatedAt: new Date() }).where(eq(core.listings.id, listing.id));
  await db.insert(core.auditEvents).values({ actorId: session.id, action: "order.reserve", entityType: "client_order", entityId: order.id, payload: {} });
  return NextResponse.json({ order }, { status: 201 });
}
