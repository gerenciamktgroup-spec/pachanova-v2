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
  const [listing] = await db.insert(core.listings).values({
    projectId: project.id,
    kind: body.kind,
    title: String(body.title || "").trim(),
    unitCode: body.unitCode ? String(body.unitCode) : null,
    price: String(body.price || "0"),
    status: "published",
  }).returning();
  await db.insert(core.auditEvents).values({ actorId: session?.id, action: "listing.create", entityType: "listing", entityId: listing.id, payload: { title: listing.title } });
  return NextResponse.json({ listing }, { status: 201 });
}
