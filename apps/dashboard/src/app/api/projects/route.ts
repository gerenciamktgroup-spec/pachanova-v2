import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { desc } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await db.select().from(core.projects).orderBy(desc(core.projects.createdAt));
    const stats = {
      total: projects.length,
      draft: projects.filter((p) => p.status === "draft").length,
      funding: projects.filter((p) => p.status === "funding").length,
      active: projects.filter((p) => p.status === "active").length,
      targetCapital: projects.reduce((sum, p) => sum + Number(p.targetCapital || 0), 0),
      raisedCapital: projects.reduce((sum, p) => sum + Number(p.raisedCapital || 0), 0),
    };
    return NextResponse.json({ projects, stats });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error listing projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (session && session.role !== "admin" && session.role !== "operator") {
      return NextResponse.json({ error: "Solo el administrador crea proyectos" }, { status: 403 });
    }

    const body = await req.json();
    const code = String(body.code || "").trim().toUpperCase();
    const name = String(body.name || "").trim();
    const type = body.type as "landbanking" | "building_sale" | "building_rent" | "other";
    if (!code || !name || !type) {
      return NextResponse.json({ error: "code, name y type son obligatorios" }, { status: 400 });
    }

    const [project] = await db
      .insert(core.projects)
      .values({
        code,
        name,
        type,
        location: String(body.location || ""),
        thesis: body.thesis ? String(body.thesis) : null,
        targetCapital: String(body.targetCapital || "0"),
        status: "draft",
        roundStatus: "planned",
        createdBy: session?.id,
      })
      .returning();

    await db.insert(core.auditEvents).values({
      actorId: session?.id,
      action: "project.create",
      entityType: "project",
      entityId: project.id,
      payload: { code, type },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating project";
    if (message.includes("unique") || message.includes("duplicate")) {
      return NextResponse.json({ error: "Ya existe un proyecto con ese código" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
