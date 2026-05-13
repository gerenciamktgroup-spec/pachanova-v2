import { NextResponse } from "next/server";
import { executeInvestorGenesisAttempt } from "@/server/demoActions/investorGenesisAttempt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { investorId, tokenAmount } = body;

    if (!investorId || !tokenAmount) {
      return NextResponse.json({ ok: false, error: "Missing parameters" }, { status: 400 });
    }

    const result = await executeInvestorGenesisAttempt(investorId, Number(tokenAmount));
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Demo action error:", error);
    const msg = error instanceof Error ? error.message : "Failed to execute demo action";
    // Do not hide error per instructions "no ocultar error", but we shouldn't leak secrets.
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 403 } // or 409
    );
  }
}
