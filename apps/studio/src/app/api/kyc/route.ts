import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ files: [], kycStatus: "pending" });
  const [profile] = await db.select().from(core.profiles).where(eq(core.profiles.email, session.email)).limit(1);
  if (!profile) return NextResponse.json({ files: [], kycStatus: "pending" });
  const files = await db.select().from(core.kycFiles).where(eq(core.kycFiles.profileId, profile.id)).orderBy(desc(core.kycFiles.createdAt));
  return NextResponse.json({ kycStatus: profile.kycStatus, files });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sesión requerida" }, { status: 401 });
  const [profile] = await db.select().from(core.profiles).where(eq(core.profiles.email, session.email)).limit(1);
  if (!profile) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
  const body = await req.json();
  const [file] = await db.insert(core.kycFiles).values({
    profileId: profile.id,
    docType: String(body.docType || "dni_front"),
    fileUrl: String(body.fileUrl || ""),
    status: "pending",
  }).returning();
  await db.update(core.profiles).set({ kycStatus: "in_review", updatedAt: new Date() }).where(eq(core.profiles.id, profile.id));
  return NextResponse.json({ file, kycStatus: "in_review" }, { status: 201 });
}
