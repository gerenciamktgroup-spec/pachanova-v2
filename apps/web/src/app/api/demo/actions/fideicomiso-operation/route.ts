import { NextResponse } from "next/server";
import { executeFideicomisoOperation } from "@/server/demoActions/fideicomisoOperation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, operationId, userId } = body;

    if (!action) {
      return NextResponse.json({ ok: false, error: "Missing action parameter" }, { status: 400 });
    }

    const result = await executeFideicomisoOperation(action, operationId, userId);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Demo action error:", error);
    const msg = error instanceof Error ? error.message : "Failed to execute demo action";
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 403 }
    );
  }
}
