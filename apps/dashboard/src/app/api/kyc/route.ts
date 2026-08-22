import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { desc, eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session?.email) return NextResponse.json({ files: [], kycStatus: "pending" });

    const [profile] = await db.select().from(core.profiles).where(eq(core.profiles.email, session.email)).limit(1);
    if (!profile) return NextResponse.json({ files: [], kycStatus: "pending" });

    const files = await db
      .select()
      .from(core.kycFiles)
      .where(eq(core.kycFiles.profileId, profile.id))
      .orderBy(desc(core.kycFiles.createdAt));

    return NextResponse.json({ kycStatus: profile.kycStatus, files });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session?.email) return NextResponse.json({ error: "Sesión requerida" }, { status: 401 });

    const [profile] = await db.select().from(core.profiles).where(eq(core.profiles.email, session.email)).limit(1);
    if (!profile) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    const body = await req.json();
    const docType = String(body.docType || "").trim();
    const fileUrl = String(body.fileUrl || "").trim();
    if (!docType || !fileUrl) {
      return NextResponse.json({ error: "docType y fileUrl obligatorios" }, { status: 400 });
    }

    const [file] = await db
      .insert(core.kycFiles)
      .values({
        profileId: profile.id,
        docType,
        fileUrl,
        status: "pending",
      })
      .returning();

    await db
      .update(core.profiles)
      .set({ kycStatus: "in_review", updatedAt: new Date() })
      .where(eq(core.profiles.id, profile.id));

    await db.insert(core.auditEvents).values({
      actorId: profile.id,
      action: "kyc.upload",
      entityType: "kyc_file",
      entityId: file.id,
      payload: { docType },
    });

    return NextResponse.json({ file, kycStatus: "in_review" }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
