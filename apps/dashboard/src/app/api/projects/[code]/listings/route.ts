import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { getSessionUser, isAdmin } from "@/lib/auth/session";
import { loadProjectByCode } from "@/lib/projects/load";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ code: string }> }
) {
  try {
    const session = await getSessionUser();
    if (session && !isAdmin(session.role)) {
      return NextResponse.json({ error: "Solo admin" }, { status: 403 });
    }
    const { code } = await ctx.params;
    const project = await loadProjectByCode(code);
    if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    const body = await req.json();
    const title = String(body.title || "").trim();
    const kind = body.kind as "lot" | "unit_sale" | "rental";
    if (!title || !kind) {
      return NextResponse.json({ error: "title y kind obligatorios" }, { status: 400 });
    }

    const [listing] = await db
      .insert(core.listings)
      .values({
        projectId: project.id,
        kind,
        title,
        description: body.description ? String(body.description) : null,
        unitCode: body.unitCode ? String(body.unitCode) : null,
        areaM2: body.areaM2 ? String(body.areaM2) : null,
        price: String(body.price || "0"),
        status: body.publish ? "published" : "draft",
      })
      .returning();

    await db.insert(core.auditEvents).values({
      actorId: session?.id,
      action: "listing.create",
      entityType: "listing",
      entityId: listing.id,
      payload: { title, kind },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
