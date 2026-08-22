import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { eq } from "drizzle-orm";
import { getSessionUser, isAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (session && !isAdmin(session.role)) {
      return NextResponse.json({ error: "Solo admin" }, { status: 403 });
    }
    const { id } = await ctx.params;
    const body = await req.json();
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (body.status) patch.status = body.status;
    if (body.price !== undefined) patch.price = String(body.price);

    const [listing] = await db
      .update(core.listings)
      .set(patch)
      .where(eq(core.listings.id, id))
      .returning();

    await db.insert(core.auditEvents).values({
      actorId: session?.id,
      action: "listing.update",
      entityType: "listing",
      entityId: id,
      payload: body,
    });

    return NextResponse.json({ listing });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
