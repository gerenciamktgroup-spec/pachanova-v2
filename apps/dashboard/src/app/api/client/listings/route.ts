import { NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { eq, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select({
        listing: core.listings,
        project: {
          id: core.projects.id,
          code: core.projects.code,
          name: core.projects.name,
          type: core.projects.type,
          location: core.projects.location,
        },
      })
      .from(core.listings)
      .innerJoin(core.projects, eq(core.listings.projectId, core.projects.id))
      .where(or(eq(core.listings.status, "published"), eq(core.listings.status, "reserved")));

    return NextResponse.json({ listings: rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error listing offers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
