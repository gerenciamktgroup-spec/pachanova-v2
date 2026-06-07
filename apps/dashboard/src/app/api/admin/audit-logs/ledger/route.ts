import { NextResponse } from "next/server";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ledgerEntries = await db.query.tokenLedger.findMany({
      orderBy: (fields, { desc }) => [desc(fields.timestamp)],
      limit: 100
    });

    return NextResponse.json({ success: true, ledger: ledgerEntries });
  } catch (error: any) {
    console.error("[ledger GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
