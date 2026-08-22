import { NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await db.select().from(core.projects).orderBy(desc(core.projects.createdAt));
    const properties = projects.map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      propertyType: p.type,
      status: p.status,
      totalValuationUsd: p.targetCapital,
      tokenPriceUsd: "0",
      totalTokens: "0",
      availableTokens: "0",
      annualYieldExpected: null,
      contractAddress: null,
      isDemo: true,
      metadata: { code: p.code, thesis: p.thesis },
      createdAt: p.createdAt,
    }));

    const stats = {
      total: properties.length,
      funding: properties.filter((p) => p.status === "funding").length,
      totalValuationUsd: properties.reduce((sum, p) => sum + Number(p.totalValuationUsd || 0), 0),
      totalTokensIssued: 0,
    };

    return NextResponse.json({ properties, stats });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching landbank";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Usá POST /api/projects. El landbank token quedó en cuarentena." },
    { status: 410 }
  );
}
