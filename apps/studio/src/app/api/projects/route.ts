import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/lib/db";
import { desc } from "drizzle-orm";
import { getSession, isStaff } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await db.select().from(core.projects).orderBy(desc(core.projects.createdAt));
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session && !isStaff(session.role)) return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  const body = await req.json();
  const code = String(body.code || "").trim().toUpperCase();
  const name = String(body.name || "").trim();
  const type = body.type;
  if (!code || !name || !type) return NextResponse.json({ error: "Completá código, nombre y tipo" }, { status: 400 });
  const [project] = await db.insert(core.projects).values({
    code, name, type,
    location: String(body.location || ""),
    thesis: body.thesis ? String(body.thesis) : null,
    targetCapital: String(body.targetCapital || "0"),
    status: "draft",
    roundStatus: "planned",
    createdBy: session?.id,
  }).returning();
  await db.insert(core.auditEvents).values({ actorId: session?.id, action: "project.create", entityType: "project", entityId: project.id, payload: { code, type } });
  return NextResponse.json({ project }, { status: 201 });
}
