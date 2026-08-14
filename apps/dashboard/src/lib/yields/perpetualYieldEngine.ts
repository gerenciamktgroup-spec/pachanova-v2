import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq, sql, gt } from "drizzle-orm";
import { emitNotification } from "@/lib/notifications/emitNotification";

export interface DistributionSummary {
  totalDistributedUsd: number;
  investorCount: number;
  periodStart: Date;
  periodEnd: Date;
  memo: string;
}

/**
 * Perpetual Yield Engine - Distributes rental and real estate yields to token co-owners
 */
export async function runPerpetualYieldEngine({
  propertyId,
  totalPoolUsd,
  memo = "Distribución Mensual de Rentas Fideicomiso San Bartolo",
  isDemo = true,
}: {
  propertyId?: string;
  totalPoolUsd: number;
  memo?: string;
  isDemo?: boolean;
}): Promise<DistributionSummary> {
  return await db.transaction(async (tx) => {
    // 1. Fetch all balances with positive tokens
    const balances = await tx.query.balances.findMany({
      where: gt(sql`(${schema.balances.availableTokens} + ${schema.balances.lockedTokens})`, 0),
    });

    if (balances.length === 0) {
      throw new Error("No hay inversores con saldo de tokens PACHA para distribuir.");
    }

    // 2. Calculate total token circulation
    const totalCirculation = balances.reduce(
      (sum, b) => sum + Number(b.availableTokens) + Number(b.lockedTokens),
      0
    );

    if (totalCirculation === 0) {
      throw new Error("Circulación total de tokens es 0.");
    }

    const now = new Date();
    const periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get default property if not specified
    let targetPropertyId = propertyId;
    if (!targetPropertyId) {
      const prop = await tx.query.properties.findFirst();
      targetPropertyId = prop?.id || "00000000-0000-0000-0000-000000000001";
    }

    let distributedCount = 0;

    // 3. Pro-rata distribution loop
    for (const b of balances) {
      const investorTokens = Number(b.availableTokens) + Number(b.lockedTokens);
      const shareRatio = investorTokens / totalCirculation;
      const investorDividend = Number((totalPoolUsd * shareRatio).toFixed(2));

      if (investorDividend > 0) {
        // Credit USD balance
        await tx.update(schema.balances)
          .set({
            availableUsd: sql`${schema.balances.availableUsd} + ${investorDividend}`,
            lastUpdatedAt: now,
          })
          .where(eq(schema.balances.investorId, b.investorId));

        // Insert distribution record
        await tx.insert(schema.distributions).values({
          propertyId: targetPropertyId,
          investorId: b.investorId,
          amountUsd: investorDividend.toString(),
          periodStart,
          periodEnd: now,
          isDemo,
        });

        // Emit notification
        await emitNotification({
          investorId: b.investorId,
          type: "dividend",
          title: "Dividendos por Renta Acreditados",
          message: `Has recibido $${investorDividend} USD por tus ${investorTokens} fracciones en el pool '${memo}'.`,
          isDemo,
        });

        distributedCount++;
      }
    }

    // 4. Audit Log
    await tx.insert(schema.auditLogs).values({
      action: "YIELD_DISTRIBUTION_EXECUTED",
      details: `Distributed $${totalPoolUsd} USD among ${distributedCount} investors. Total circulation: ${totalCirculation} PACHA.`,
    });

    return {
      totalDistributedUsd: totalPoolUsd,
      investorCount: distributedCount,
      periodStart,
      periodEnd: now,
      memo,
    };
  });
}
