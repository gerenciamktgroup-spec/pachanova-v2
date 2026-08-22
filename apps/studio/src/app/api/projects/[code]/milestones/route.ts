import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, isStaff } from "@/lib/session";
import { projectByCode } from "@/lib/projects";

export async function POST(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const session = await getSession();
  if (session && !isStaff(session.role)) return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  const { code } = await ctx.params;
  const project = await projectByCode(code);
  if (!project) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const body = await req.json();
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "Falta el título" }, { status: 400 });
  const [milestone] = await db.insert(core.projectMilestones).values({ projectId: project.id, title }).returning();
  await db.insert(core.auditEvents).values({ actorId: session?.id, action: "milestone.create", entityType: "milestone", entityId: milestone.id, payload: { title } });
  return NextResponse.json({ milestone }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (session && !isStaff(session.role)) return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  const body = await req.json();
  const [milestone] = await db.update(core.projectMilestones).set({
    status: body.status,
    completedAt: body.status === "done" ? new Date() : null,
  }).where(eq(core.projectMilestones.id, body.id)).returning();
  return NextResponse.json({ milestone });
}
