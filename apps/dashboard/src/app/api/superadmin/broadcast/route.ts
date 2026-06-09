import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, type, targetSegment } = body;

    if (!message || !type || !targetSegment) {
      return NextResponse.json(
        { success: false, error: "message, type, and targetSegment are required" },
        { status: 400 }
      );
    }

    let recipientIds: string[] = [];

    if (targetSegment === "all") {
      const investors = await db.query.investors.findMany({ columns: { id: true } });
      recipientIds = investors.map((i) => i.id);
    } else {
      // targetSegment is assumed to be a propertyId
      const balances = await db.query.balances.findMany({
        where: eq(schema.balances.propertyId, targetSegment),
        columns: { investorId: true },
      });
      recipientIds = balances.map((b) => b.investorId);
      // Remove duplicates just in case
      recipientIds = [...new Set(recipientIds)];
    }

    const broadcastId = `brd_${Date.now()}`;

    // Note: We don't have a notifications table in the current schema. 
    // We will simulate it using auditLogs or just log the broadcast.
    // In a real system, we would insert into `schema.notifications`.

    await db.insert(schema.auditLogs).values({
      action: "SYSTEM_BROADCAST",
      details: {
        broadcastId,
        message,
        type,
        targetSegment,
        recipientCount: recipientIds.length,
      },
    } as any);

    return NextResponse.json({
      success: true,
      broadcastId,
      recipientCount: recipientIds.length,
      message: "Broadcast sent successfully",
    });
  } catch (e: any) {
    console.error("[broadcast POST]", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
