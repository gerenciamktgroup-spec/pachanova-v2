import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq, desc, and, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/yield/distributions?investorId=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const investorId = searchParams.get("investorId");
    const status = searchParams.get("status");

    if (!investorId) {
      return NextResponse.json({ error: "investorId required" }, { status: 400 });
    }

    const whereConditions = [eq(schema.distributions.investorId, investorId)];
    if (status) {
      whereConditions.push(eq(schema.distributions.status, status));
    }

    const rawDists = await db.execute(sql`
      SELECT 
        d.id,
        d.property_id as "propertyId",
        d.investor_id as "investorId",
        d.amount_usd as "amountUsd",
        d.period_start as "periodStart",
        d.period_end as "periodEnd",
        d.status,
        d.proof_ref as "proofRef",
        d.claimed_at as "claimedAt",
        d.created_at as "createdAt",
        p.name as "propertyName",
        p.property_type as "propertyType",
        p.location
      FROM public.distributions d
      INNER JOIN public.properties p ON d.property_id = p.id
      WHERE d.investor_id = ${investorId}
        ${status ? sql`AND d.status = ${status}` : sql``}
      ORDER BY d.created_at DESC
    `);

    const distributions = rawDists as any[];

    const totalClaimable = distributions
      .filter((d) => d.status === "CLAIMABLE")
      .reduce((sum, d) => sum + Number(d.amountUsd), 0);

    const totalClaimed = distributions
      .filter((d) => d.status === "CLAIMED")
      .reduce((sum, d) => sum + Number(d.amountUsd), 0);

    return NextResponse.json({
      distributions,
      summary: {
        total: distributions.length,
        totalClaimable: Math.round(totalClaimable * 100) / 100,
        totalClaimed: Math.round(totalClaimed * 100) / 100,
        claimableCount: distributions.filter((d) => d.status === "CLAIMABLE").length,
        claimedCount: distributions.filter((d) => d.status === "CLAIMED").length,
      },
    });
  } catch (err: any) {
    console.error("[yield/distributions GET]", err);
    return NextResponse.json(
      { error: err?.message || "Error fetching distributions" },
      { status: 500 }
    );
  }
}

// POST /api/yield/distributions - claim a distribution
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { distributionId, investorId, action } = body;

    if (!distributionId || !investorId) {
      return NextResponse.json(
        { error: "distributionId and investorId required" },
        { status: 400 }
      );
    }

    const distribution = await db.query.distributions.findFirst({
      where: and(
        eq(schema.distributions.id, distributionId),
        eq(schema.distributions.investorId, investorId)
      ),
    });

    if (!distribution) {
      return NextResponse.json(
        { error: "Distribution not found or not yours" },
        { status: 404 }
      );
    }

    if (distribution.status !== "CLAIMABLE") {
      return NextResponse.json(
        { error: `Cannot claim: status is ${distribution.status}` },
        { status: 400 }
      );
    }

    const crypto = require("crypto");
    const claimTxHash = "0x" + crypto.randomBytes(32).toString("hex");
    const blockNum = 25240000 + Math.floor(Math.random() * 5000);

    if (action === "claim") {
      // Mark as CLAIMED
      await db
        .update(schema.distributions)
        .set({
          status: "CLAIMED",
          claimedAt: new Date(),
          compoundDetails: {
            action: "claim",
            txHash: claimTxHash,
            blockNum,
            timestamp: new Date().toISOString(),
          },
        } as any)
        .where(eq(schema.distributions.id, distributionId));

      // Create audit log
      await db.insert(schema.auditLogs).values({
        action: "YIELD_CLAIMED",
        details: {
          distributionId,
          investorId,
          amountUsd: distribution.amountUsd,
          txHash: claimTxHash,
          blockNum,
        },
      } as any);

      return NextResponse.json({
        success: true,
        action: "claimed",
        txHash: claimTxHash,
        blockNum,
        amountUsd: distribution.amountUsd,
      });
    } else if (action === "compound") {
      // Compound: mark claimed and add to investor's USD balance
      await db
        .update(schema.distributions)
        .set({
          status: "CLAIMED",
          claimedAt: new Date(),
          compoundDetails: {
            action: "compound",
            txHash: claimTxHash,
            blockNum,
            timestamp: new Date().toISOString(),
            reinvested: true,
          },
        } as any)
        .where(eq(schema.distributions.id, distributionId));

      // Add to investor's available_usd in first balance (or any balance for this property)
      const balanceRow = await db.query.balances.findFirst({
        where: and(
          eq(schema.balances.investorId, investorId),
          eq(schema.balances.propertyId, distribution.propertyId)
        ),
      });

      if (balanceRow) {
        const newUsd = (
          parseFloat(balanceRow.availableUsd || "0") +
          parseFloat(distribution.amountUsd)
        ).toFixed(2);
        await db
          .update(schema.balances)
          .set({ availableUsd: newUsd, lastUpdatedAt: new Date() })
          .where(eq(schema.balances.id, balanceRow.id));
      }

      await db.insert(schema.auditLogs).values({
        action: "YIELD_COMPOUNDED",
        details: {
          distributionId,
          investorId,
          amountUsd: distribution.amountUsd,
          txHash: claimTxHash,
          blockNum,
          reinvested: true,
        },
      } as any);

      return NextResponse.json({
        success: true,
        action: "compounded",
        txHash: claimTxHash,
        blockNum,
        amountUsd: distribution.amountUsd,
        reinvestedToBalance: true,
      });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error("[yield/distributions POST]", err);
    return NextResponse.json(
      { error: err?.message || "Error processing claim" },
      { status: 500 }
    );
  }
}
