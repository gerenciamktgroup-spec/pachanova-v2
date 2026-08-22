import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { eq } from "drizzle-orm";
import { getSessionUser, isAdmin } from "@/lib/auth/session";
import { loadProjectBundle, loadProjectByCode } from "@/lib/projects/load";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await ctx.params;
    const bundle = await loadProjectBundle(code);
    if (!bundle) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    return NextResponse.json(bundle);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
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
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (body.status) patch.status = body.status;
    if (body.roundStatus) patch.roundStatus = body.roundStatus;
    if (body.thesis !== undefined) patch.thesis = body.thesis;
    if (body.location !== undefined) patch.location = body.location;
    if (body.targetCapital !== undefined) patch.targetCapital = String(body.targetCapital);

    const [updated] = await db
      .update(core.projects)
      .set(patch)
      .where(eq(core.projects.id, project.id))
      .returning();

    await db.insert(core.auditEvents).values({
      actorId: session?.id,
      action: "project.update",
      entityType: "project",
      entityId: project.id,
      payload: body,
    });

    return NextResponse.json({ project: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
