import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, isStaff } from "@/lib/session";
import { projectBundle, projectByCode } from "@/lib/projects";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const bundle = await projectBundle(code);
  if (!bundle) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(bundle);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const session = await getSession();
  if (session && !isStaff(session.role)) return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  const { code } = await ctx.params;
  const project = await projectByCode(code);
  if (!project) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const body = await req.json();
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (body.status) patch.status = body.status;
  if (body.roundStatus) patch.roundStatus = body.roundStatus;
  const [updated] = await db.update(core.projects).set(patch).where(eq(core.projects.id, project.id)).returning();
  await db.insert(core.auditEvents).values({ actorId: session?.id, action: "project.update", entityType: "project", entityId: project.id, payload: body });
  return NextResponse.json({ project: updated });
}
