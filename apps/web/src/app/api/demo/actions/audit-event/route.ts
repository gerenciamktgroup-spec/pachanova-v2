import { NextResponse } from "next/server";
import { logDemoAuditEvent } from "@/server/demoActions/auditEvent";
import { assertSafeDemoAction } from "@/server/demoActions/demoActionGuards";

export async function POST(req: Request) {
  try {
    assertSafeDemoAction();
    const body = await req.json();
    const { action, details, userId } = body;

    if (!action || !details) {
      return NextResponse.json({ ok: false, error: "Missing parameters" }, { status: 400 });
    }

    await logDemoAuditEvent(action, details, userId);
    return NextResponse.json({ ok: true, status: "logged", simulated: true });
  } catch (error: unknown) {
    console.error("Demo action error:", error);
    const msg = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 403 });
  }
}
