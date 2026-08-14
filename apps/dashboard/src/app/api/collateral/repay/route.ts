export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { executeRepayLoan } from "@/lib/lending/collateralEngine";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { loanId, investorEmail = "demo.investor.holder@pachanova.local" } = body;

    if (!loanId) {
      return NextResponse.json({ error: "loanId requerido" }, { status: 400 });
    }

    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, investorEmail),
    });

    if (!investor) {
      return NextResponse.json({ error: "Inversor no encontrado" }, { status: 404 });
    }

    const result = await executeRepayLoan({
      loanId,
      investorId: investor.id,
      isDemo: true,
    });

    return NextResponse.json({
      success: true,
      result,
      message: "Préstamo cancelado y tokens PACHA liberados.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al cancelar el préstamo";
    console.error("Error in collateral repay API:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
