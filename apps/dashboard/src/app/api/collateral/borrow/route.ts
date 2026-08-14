export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { executeBorrowPosition, calculateCollateralLoanEstimate } from "@/lib/lending/collateralEngine";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pachaAmount, borrowUsd, investorEmail = "demo.investor.holder@pachanova.local" } = body;

    if (!pachaAmount || pachaAmount <= 0) {
      return NextResponse.json({ error: "Cantidad de tokens inválida" }, { status: 400 });
    }

    // Find investor
    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, investorEmail),
    });

    if (!investor) {
      return NextResponse.json({ error: "Inversor no encontrado" }, { status: 404 });
    }

    const estimate = calculateCollateralLoanEstimate(pachaAmount);
    const finalBorrowAmount = borrowUsd ? Math.min(borrowUsd, estimate.maxBorrowUsd) : estimate.maxBorrowUsd;

    const loan = await executeBorrowPosition({
      investorId: investor.id,
      pachaAmount: Number(pachaAmount),
      borrowUsd: finalBorrowAmount,
      isDemo: true,
    });

    return NextResponse.json({
      success: true,
      loan,
      message: `Préstamo de $${finalBorrowAmount} USD acreditado exitosamente dejando ${pachaAmount} PACHA en garantía.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al procesar el préstamo";
    console.error("Error in collateral borrow API:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
