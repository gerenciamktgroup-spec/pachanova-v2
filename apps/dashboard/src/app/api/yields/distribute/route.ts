export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { runPerpetualYieldEngine } from "@/lib/yields/perpetualYieldEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { totalPoolUsd = 10000, memo = "Distribución Mensual de Rentas Fideicomiso San Bartolo" } = body;

    if (totalPoolUsd <= 0) {
      return NextResponse.json({ error: "El monto del pool debe ser mayor a 0" }, { status: 400 });
    }

    const summary = await runPerpetualYieldEngine({
      totalPoolUsd: Number(totalPoolUsd),
      memo,
      isDemo: true,
    });

    return NextResponse.json({
      success: true,
      summary,
      message: `Distribución de $${totalPoolUsd} USD ejecutada exitosamente entre ${summary.investorCount} co-propietarios.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al ejecutar la distribución";
    console.error("Error in yield distribution API:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
