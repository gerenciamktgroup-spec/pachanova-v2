import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { getSession, isStaff } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (session && !isStaff(session.role)) return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  const items = await db.select({
    file: core.kycFiles,
    profile: { email: core.profiles.email, fullName: core.profiles.fullName, role: core.profiles.role, kycStatus: core.profiles.kycStatus },
  }).from(core.kycFiles).innerJoin(core.profiles, eq(core.kycFiles.profileId, core.profiles.id)).orderBy(desc(core.kycFiles.createdAt));
  return NextResponse.json({ items });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (session && !isStaff(session.role)) return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  const body = await req.json();
  const [file] = await db.update(core.kycFiles).set({
    status: body.status,
    reviewedBy: session?.id,
    reviewedAt: new Date(),
  }).where(eq(core.kycFiles.id, body.fileId)).returning();
  if (file) await db.update(core.profiles).set({ kycStatus: body.status, updatedAt: new Date() }).where(eq(core.profiles.id, file.profileId));
  return NextResponse.json({ file });
}
