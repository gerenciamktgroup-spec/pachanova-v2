import { NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionUser();
    const email = session?.email || "inversor@pachanova.local";

    const [profile] = await db
      .select()
      .from(core.profiles)
      .where(eq(core.profiles.email, email))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ participations: [] });
    }

    const rows = await db
      .select({
        participation: core.participations,
        project: core.projects,
      })
      .from(core.participations)
      .innerJoin(core.projects, eq(core.participations.projectId, core.projects.id))
      .where(eq(core.participations.investorId, profile.id));

    return NextResponse.json({
      profile: { id: profile.id, email: profile.email, role: profile.role, kycStatus: profile.kycStatus },
      participations: rows,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error listing participations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
