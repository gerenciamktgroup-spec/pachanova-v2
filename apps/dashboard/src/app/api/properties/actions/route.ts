import { createHash, randomUUID } from "crypto";

import { DEFAULT_DEMO_INVESTOR, schema } from "@pachanova/database";
import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/server/db";
import { assertDemoRequest } from "@/server/demoActions/demoRequestGuard";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  propertyId: z.string().uuid(),
  action: z.enum(["launch", "borrow", "claim", "vote", "perpetual"]),
  payload: z.object({
    borrowedAmount: z.number().positive().max(100000).optional(),
    claimAmount: z.number().positive().max(100000).optional(),
  }).optional(),
});

function ledgerHash(previousHash: string, operation: string, investorId: string, amount: number, timestamp: Date) {
  return `0x${createHash("sha256").update(`${previousHash}:${operation}:${investorId}:${amount}:${timestamp.toISOString()}`).digest("hex")}`;
}

export async function POST(request: Request) {
  try {
    assertDemoRequest(request);
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Parámetros inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const { propertyId, action, payload } = parsed.data;

    const evidence = await db.transaction(async (tx) => {
      const [investor, property] = await Promise.all([
        tx.query.investors.findFirst({ where: eq(schema.investors.email, DEFAULT_DEMO_INVESTOR.email) }),
        tx.query.properties.findFirst({ where: eq(schema.properties.id, propertyId) }),
      ]);

      if (!investor || investor.kycStatus !== "approved") throw new Error("El inversor demo aprobado no está inicializado");
      if (!property || !property.isDemo) throw new Error("El PNC demo solicitado no existe");

      if (action === "launch") {
        await tx.update(schema.properties).set({ status: "trading", updatedAt: new Date() }).where(eq(schema.properties.id, propertyId));
        await tx.insert(schema.auditLogs).values({ action: "PROPERTY_LAUNCHED", details: `PNC ${propertyId} habilitado para trading demo`, userId: investor.id });
        return { action, propertyId, status: "trading" };
      }

      if (action === "vote") {
        const voteId = randomUUID();
        await tx.insert(schema.auditLogs).values({ action: "GOV_VOTE_CAST", details: `Voto demo ${voteId} emitido para PNC ${propertyId}`, userId: investor.id });
        await tx.insert(schema.integrationEvents).values({
          provider: "DEMO_GOVERNANCE",
          eventType: "GOV_VOTE_CAST_SIMULATED",
          payload: { voteId, propertyId, investorId: investor.id, decision: "approve" },
          simulated: true,
        });
        return { action, propertyId, voteId, decision: "approve" };
      }

      const balance = await tx.query.balances.findFirst({ where: eq(schema.balances.investorId, investor.id) });
      if (!balance) throw new Error("El saldo del inversor demo no está inicializado");

      if (action === "borrow") {
        const borrowedAmount = payload?.borrowedAmount ?? 30000;
        const collateralReference = Number(property.totalValuationUsd);
        const maxBorrow = Math.min(100000, collateralReference * 0.5);
        if (borrowedAmount > maxBorrow) throw new Error(`El préstamo excede el LTV demo máximo de USD ${maxBorrow.toFixed(2)}`);

        const [updatedBalance] = await tx.update(schema.balances)
          .set({ availableUsd: sql`${schema.balances.availableUsd} + ${borrowedAmount}`, lastUpdatedAt: new Date() })
          .where(eq(schema.balances.investorId, investor.id))
          .returning({ availableUsd: schema.balances.availableUsd });

        const reference = `borrow-${randomUUID()}`;
        await tx.insert(schema.transactions).values({
          receiverId: investor.id,
          propertyId,
          amount: borrowedAmount.toString(),
          currency: "USD",
          type: "deposit",
          status: "completed",
          paymentProvider: "DEMO_CREDIT_ENGINE",
          paymentReference: reference,
          isDemo: true,
          metadata: { kind: "collateralized_borrow", ltv: borrowedAmount / collateralReference, collateralReference },
        });
        await tx.insert(schema.auditLogs).values({ action: "BORROW_POSITION_CREATED", details: `Crédito demo ${reference}: USD ${borrowedAmount} respaldado por PNC ${propertyId}`, userId: investor.id });
        return { action, propertyId, reference, borrowedAmount, availableUsd: updatedBalance.availableUsd };
      }

      const amount = action === "perpetual" ? 8514 : (payload?.claimAmount ?? 23125);
      const now = new Date();
      const latestLedger = await tx.query.tokenLedger.findFirst({
        where: eq(schema.tokenLedger.investorId, investor.id),
        orderBy: [desc(schema.tokenLedger.timestamp)],
      });
      const previousHash = latestLedger?.currentHash ?? "0x0000000000000000000000000000000000000000000000000000000000000000";
      const currentHash = ledgerHash(previousHash, action, investor.id, amount, now);
      const txHash = `0x${createHash("sha256").update(`${action}:${randomUUID()}`).digest("hex")}`;

      const [updatedBalance] = await tx.update(schema.balances)
        .set({ availableTokens: sql`${schema.balances.availableTokens} + ${amount}`, lastUpdatedAt: now })
        .where(eq(schema.balances.investorId, investor.id))
        .returning({ availableTokens: schema.balances.availableTokens });

      await tx.insert(schema.tokenLedger).values({ investorId: investor.id, amount: amount.toString(), operation: "mint", txHash, previousHash, currentHash, timestamp: now });
      await tx.insert(schema.transactions).values({
        receiverId: investor.id,
        propertyId,
        amount: amount.toString(),
        currency: "PACHA",
        type: "dividend",
        status: "completed",
        txHash,
        isDemo: true,
        metadata: { kind: action === "perpetual" ? "perpetual_yield_attestation" : "yield_claim", previousHash, currentHash },
      });

      const eventType = action === "perpetual" ? "YIELD_PERPETUAL_ATTEST" : "YIELD_CLAIMED_SIMULATED";
      await tx.insert(schema.auditLogs).values({ action: eventType, details: `${amount} PACHA acreditados desde PNC ${propertyId}; tx ${txHash}`, userId: investor.id });
      await tx.insert(schema.integrationEvents).values({ provider: action === "perpetual" ? "ORQ_DEMO_BRIDGE" : "DEMO_YIELD_ENGINE", eventType, payload: { propertyId, investorId: investor.id, amount, txHash, previousHash, currentHash }, txHash, simulated: true });

      return { action, propertyId, amount, txHash, previousHash, currentHash, availableTokens: updatedBalance.availableTokens };
    });

    return NextResponse.json({ success: true, evidence });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
