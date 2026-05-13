import { NextResponse } from "next/server";
import { executeAdminUserReview } from "@/server/demoActions/adminUserReview";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ ok: false, error: "Missing parameters" }, { status: 400 });
    }

    const result = await executeAdminUserReview(userId, action);
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
