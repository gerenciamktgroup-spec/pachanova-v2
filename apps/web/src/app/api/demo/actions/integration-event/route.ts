import { NextResponse } from "next/server";
import { logDemoIntegrationEvent } from "@/server/demoActions/integrationEvent";
import { assertSafeDemoAction } from "@/server/demoActions/demoActionGuards";

export async function POST(req: Request) {
  try {
    assertSafeDemoAction();
    const body = await req.json();
    const { provider, eventType, status, payload } = body;

    if (!provider || !eventType || !status) {
      return NextResponse.json({ ok: false, error: "Missing parameters" }, { status: 400 });
    }

    const id = await logDemoIntegrationEvent(provider, eventType, status, payload);
    return NextResponse.json({ ok: true, id, status: "logged", simulated: true });
  } catch (error: unknown) {
    console.error("Demo action error:", error);
    const msg = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 403 });
  }
}
