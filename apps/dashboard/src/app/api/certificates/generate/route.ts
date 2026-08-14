export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { generateDigitalDeedCertificate } from "@/lib/deeds/certificateEngine";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || "demo.investor.holder@pachanova.local";

    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, email),
    });

    if (!investor) {
      return NextResponse.json({ error: "Inversor no encontrado" }, { status: 404 });
    }

    const balance = await db.query.balances.findFirst({
      where: eq(schema.balances.investorId, investor.id),
    });

    const totalTokens = Number(balance?.availableTokens || 0) + Number(balance?.lockedTokens || 0);

    const certificate = generateDigitalDeedCertificate({
      investorId: investor.id,
      firstName: investor.firstName || "Inversor",
      lastName: investor.lastName || "Demo",
      tokenCount: totalTokens > 0 ? totalTokens : 125, // default to 125 (12.5 m2) if new
    });

    return NextResponse.json({ success: true, certificate });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error generando certificado";
    console.error("Error generating deed certificate:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
