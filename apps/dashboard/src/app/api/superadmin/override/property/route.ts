import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const ALLOWED_FIELDS = [
  "status",
  "tokenPriceUsd",
  "totalValuationUsd",
  "availableTokens",
  "annualYieldExpected",
  "name",
  "location",
  // Fase3: Master override for borrow/credits (LTV/rate per 5PNC landbank collateral, stored in metadata for API consume)
  "borrowLtv",
  "borrowInterestRate",
  "manualOverrideNote"
];

const VALID_STATUSES = ["coming_soon", "funding", "funded", "trading", "liquidated"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { propertyId, field, value, reason } = body;

    if (!propertyId || !field || value === undefined || !reason) {
      return NextResponse.json(
        { success: false, error: "propertyId, field, value, and reason are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_FIELDS.includes(field)) {
      return NextResponse.json({ success: false, error: `Invalid field for property override: ${field}` }, { status: 400 });
    }

    if (field === "status" && !VALID_STATUSES.includes(value)) {
      return NextResponse.json({ success: false, error: `Invalid status value. Must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
    }

    const prop = await db.query.properties.findFirst({
      where: eq(schema.properties.id, propertyId),
    });

    if (!prop) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
    }

    const oldValue = (prop as any)[field];

    const updateSet: any = { updatedAt: new Date() };
    if (["borrowLtv", "borrowInterestRate", "manualOverrideNote"].includes(field)) {
      // Fase3: persist borrow overrides into metadata jsonb (read by /api/borrow + DeFi client for real 5PNC)
      const currentMeta = (prop as any).metadata || {};
      const metaKey = field === 'borrowLtv' ? 'borrow_ltv_override' : field === 'borrowInterestRate' ? 'borrow_interest_rate' : 'manual_override_note';
      updateSet.metadata = { ...currentMeta, [metaKey]: value, last_master_borrow_override: new Date().toISOString() };
      // also set top level note for visibility
      if (field === 'manualOverrideNote') updateSet.manualOverrideNote = value; // if col exists, else meta
    } else {
      updateSet[field] = value;
    }

    await db
      .update(schema.properties)
      .set(updateSet)
      .where(eq(schema.properties.id, propertyId));

    await db.insert(schema.auditLogs).values({
      action: "MASTER_OVERRIDE_PROPERTY",
      details: { propertyId, field, oldValue, newValue: value, reason },
    } as any);

    return NextResponse.json({ success: true, message: `Property override applied successfully on field '${field}'.` });
  } catch (e: any) {
    console.error("[override/property POST]", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
