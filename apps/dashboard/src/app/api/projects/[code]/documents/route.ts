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
    if (!title) return NextResponse.json({ error: "title obligatorio" }, { status: 400 });

    const [doc] = await db
      .insert(core.projectDocuments)
      .values({
        projectId: project.id,
        title,
        category: String(body.category || "general"),
        fileUrl: String(body.fileUrl || ""),
        visibility: String(body.visibility || "investor"),
        uploadedBy: session?.id,
      })
      .returning();

    await db.insert(core.auditEvents).values({
      actorId: session?.id,
      action: "document.create",
      entityType: "project_document",
      entityId: doc.id,
      payload: { project: code, title },
    });

    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
