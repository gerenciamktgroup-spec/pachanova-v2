import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { investorId, field, value, reason, propertyId } = body;

    if (!investorId || !field || value === undefined || !reason) {
      return NextResponse.json(
        { success: false, error: "investorId, field, value, and reason are required" },
        { status: 400 }
      );
    }

    let oldValue = null;

    if (field === "kycStatus") {
      const inv = await db.query.investors.findFirst({
        where: eq(schema.investors.id, investorId),
      });
      if (!inv) return NextResponse.json({ success: false, error: "Investor not found" }, { status: 404 });
      oldValue = inv.kycStatus;

      await db
        .update(schema.investors)
        .set({ kycStatus: value } as any)
        .where(eq(schema.investors.id, investorId));
    } else if (field === "availableUsd" || field === "availableTokens") {
      // Find balance
      const whereClause = propertyId 
        ? and(eq(schema.balances.investorId, investorId), eq(schema.balances.propertyId, propertyId))
        : eq(schema.balances.investorId, investorId);

      const balance = await db.query.balances.findFirst({
        where: whereClause,
      });

      if (!balance) return NextResponse.json({ success: false, error: "Balance record not found" }, { status: 404 });
      
      oldValue = field === "availableUsd" ? balance.availableUsd : balance.availableTokens;

      await db
        .update(schema.balances)
        .set({ [field]: value, lastUpdatedAt: new Date() } as any)
        .where(eq(schema.balances.id, balance.id));
    } else {
      return NextResponse.json({ success: false, error: `Unsupported override field: ${field}` }, { status: 400 });
    }

    await db.insert(schema.auditLogs).values({
      action: "MASTER_OVERRIDE_INVESTOR",
      details: { investorId, field, oldValue, newValue: value, reason, propertyId },
    } as any);

    return NextResponse.json({ success: true, message: `Investor override applied successfully on field '${field}'.` });
  } catch (e: any) {
    console.error("[override/investor POST]", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
