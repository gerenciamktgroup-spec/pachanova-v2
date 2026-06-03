import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const params = await db.query.systemParameters.findMany();
    return NextResponse.json({ success: true, data: params });
  } catch (e: any) {
    console.error("[system-params GET]", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value, description, reason } = body;

    if (!key || !value || !reason) {
      return NextResponse.json(
        { success: false, error: "key, value, and reason are required" },
        { status: 400 }
      );
    }

    // Upsert the system parameter using standard Drizzle
    await db
      .insert(schema.systemParameters)
      .values({ key, value, description } as any)
      .onConflictDoUpdate({
        target: schema.systemParameters.key,
        set: { value, description, updatedAt: new Date() },
      });

    // Audit log the change
    await db.insert(schema.auditLogs).values({
      action: "SYSTEM_PARAM_UPDATE",
      details: { key, value, reason },
    } as any);

    return NextResponse.json({ success: true, message: `System parameter '${key}' updated successfully.` });
  } catch (e: any) {
    console.error("[system-params POST]", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
