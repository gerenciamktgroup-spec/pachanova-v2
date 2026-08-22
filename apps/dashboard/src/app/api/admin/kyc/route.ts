import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { desc, eq } from "drizzle-orm";
import { getSessionUser, isAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (session && !isAdmin(session.role)) {
      return NextResponse.json({ error: "Solo admin" }, { status: 403 });
    }

    const rows = await db
      .select({
        file: core.kycFiles,
        profile: {
          id: core.profiles.id,
          email: core.profiles.email,
          fullName: core.profiles.fullName,
          role: core.profiles.role,
          kycStatus: core.profiles.kycStatus,
        },
      })
      .from(core.kycFiles)
      .innerJoin(core.profiles, eq(core.kycFiles.profileId, core.profiles.id))
      .orderBy(desc(core.kycFiles.createdAt));

    return NextResponse.json({ items: rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (session && !isAdmin(session.role)) {
      return NextResponse.json({ error: "Solo admin" }, { status: 403 });
    }
    const body = await req.json();
    if (!body.fileId || !body.status) {
      return NextResponse.json({ error: "fileId y status obligatorios" }, { status: 400 });
    }
    if (body.status !== "approved" && body.status !== "rejected") {
      return NextResponse.json({ error: "status inválido" }, { status: 400 });
    }

    const [file] = await db
      .update(core.kycFiles)
      .set({
        status: body.status,
        notes: body.notes ? String(body.notes) : null,
        reviewedBy: session?.id,
        reviewedAt: new Date(),
      })
      .where(eq(core.kycFiles.id, body.fileId))
      .returning();

    if (file) {
      await db
        .update(core.profiles)
        .set({ kycStatus: body.status, updatedAt: new Date() })
        .where(eq(core.profiles.id, file.profileId));
    }

    await db.insert(core.auditEvents).values({
      actorId: session?.id,
      action: `kyc.${body.status}`,
      entityType: "kyc_file",
      entityId: body.fileId,
      payload: { notes: body.notes || null },
    });

    return NextResponse.json({ file });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
