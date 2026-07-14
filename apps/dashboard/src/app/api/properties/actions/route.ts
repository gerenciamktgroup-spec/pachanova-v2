import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq, sql } from "drizzle-orm";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { propertyId, action, payload } = body;

    if (!propertyId || !action) {
      return NextResponse.json({ success: false, error: "Missing propertyId or action" }, { status: 400 });
    }

    // 1. Fetch default investor
    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, "demo.investor.holder@pachanova.local")
    });

    if (!investor) {
      return NextResponse.json({ success: false, error: "Default investor not found" }, { status: 404 });
    }

    if (action === "launch") {
      await db.update(schema.properties)
        .set({ status: "trading" })
        .where(eq(schema.properties.id, propertyId));

      await db.insert(schema.auditLogs).values({
        action: "PROPERTY_LAUNCHED",
        details: `Property ${propertyId} launched (Master Launch).`,
        userId: investor.id
      });

      await db.insert(schema.integrationEvents).values({
        provider: "DEMO_SYSTEM",
        eventType: "PROPERTY_LAUNCHED_SIMULATED",
        payload: { propertyId },
        simulated: true
      });

      return NextResponse.json({ success: true, message: "Property launched successfully" });
    }

    if (action === "borrow") {
      const borrowAmount = Number(payload?.borrowedAmount || 30000);

      // Increment USD balance of investor
      const balance = await db.query.balances.findFirst({
        where: eq(schema.balances.investorId, investor.id)
      });

      if (balance) {
        const currentUsd = Number(balance.availableUsd || 0);
        await db.update(schema.balances)
          .set({ availableUsd: (currentUsd + borrowAmount).toString() })
          .where(eq(schema.balances.investorId, investor.id));
      }

      await db.insert(schema.auditLogs).values({
        action: "BORROW_POSITION_CREATED",
        details: `Investor borrowed $${borrowAmount.toLocaleString()} backed by property ${propertyId}`,
        userId: investor.id
      });

      await db.insert(schema.integrationEvents).values({
        provider: "DEMO_SYSTEM",
        eventType: "BORROW_SIMULATED",
        payload: { propertyId, investorId: investor.id, borrowAmount },
        simulated: true
      });

      return NextResponse.json({ success: true, message: `Borrowed $${borrowAmount.toLocaleString()} successfully` });
    }

    if (action === "claim") {
      const claimAmount = Number(payload?.claimAmount || 23125);

      // Increment token balance of investor
      const balance = await db.query.balances.findFirst({
        where: eq(schema.balances.investorId, investor.id)
      });

      if (balance) {
        const currentTokens = Number(balance.availableTokens || 0);
        await db.update(schema.balances)
          .set({ availableTokens: (currentTokens + claimAmount).toString() })
          .where(eq(schema.balances.investorId, investor.id));
      }

      // Add to ledger
      await db.insert(schema.tokenLedger).values({
        investorId: investor.id,
        amount: claimAmount.toString(),
        operation: "mint",
        txHash: `claim-${crypto.randomUUID().slice(0, 8)}`,
        previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        currentHash: crypto.randomUUID()
      });

      await db.insert(schema.auditLogs).values({
        action: "YIELD_CLAIMED",
        details: `Investor claimed ${claimAmount.toLocaleString()} PACHA yield from property ${propertyId}`,
        userId: investor.id
      });

      await db.insert(schema.integrationEvents).values({
        provider: "DEMO_SYSTEM",
        eventType: "YIELD_CLAIMED_SIMULATED",
        payload: { propertyId, investorId: investor.id, claimAmount },
        simulated: true
      });

      return NextResponse.json({ success: true, message: `Claimed ${claimAmount.toLocaleString()} PACHA successfully` });
    }

    if (action === "vote") {
      await db.insert(schema.auditLogs).values({
        action: "GOV_VOTE_CAST",
        details: `Investor voted on proposal for property ${propertyId}`,
        userId: investor.id
      });

      await db.insert(schema.integrationEvents).values({
        provider: "DEMO_SYSTEM",
        eventType: "GOV_VOTE_CAST_SIMULATED",
        payload: { propertyId, investorId: investor.id },
        simulated: true
      });

      return NextResponse.json({ success: true, message: "Governance vote registered successfully" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Error executing property action API:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
