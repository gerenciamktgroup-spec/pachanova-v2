import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/lib/db";
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
  const [doc] = await db.insert(core.projectDocuments).values({
    projectId: project.id,
    title,
    category: String(body.category || "general"),
    fileUrl: String(body.fileUrl || ""),
    visibility: String(body.visibility || "investor"),
    uploadedBy: session?.id,
  }).returning();
  await db.insert(core.auditEvents).values({ actorId: session?.id, action: "document.create", entityType: "project_document", entityId: doc.id, payload: { title } });
  return NextResponse.json({ document: doc }, { status: 201 });
}
