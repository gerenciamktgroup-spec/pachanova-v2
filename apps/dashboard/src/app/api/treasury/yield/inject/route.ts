import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const bodySchema = z.object({
  propertyId: z.string().uuid(),
  amountUsd: z.number().positive(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: "Invalid params", details: result.error }, { status: 400 });

    const { propertyId, amountUsd, source } = result.data;

    await db.transaction(async (tx) => {
      // Find the treasury vault
      const vault = await tx.query.treasury_vaults.findFirst({
        where: eq(schema.treasury_vaults.propertyId, propertyId),
      });

      if (!vault) throw new Error("No treasury vault found for this property.");

      // Update Accumulated Yield
      await tx.update(schema.treasury_vaults)
        .set({
          accumulatedYieldUsd: sql`${schema.treasury_vaults.accumulatedYieldUsd} + ${amountUsd}`,
          lastYieldInjectionAt: new Date(),
        })
        .where(eq(schema.treasury_vaults.id, vault.id));

      // Log in Audit (Ledger)
      await tx.insert(schema.auditLogs).values({
        action: "YIELD_INJECTED_TO_VAULT",
        details: `Injected ${amountUsd} USD into Treasury Vault ${vault.id} from ${source || 'Master'}.`,
      });

      // Insert an integration event
      await tx.insert(schema.integrationEvents).values({
        provider: "PACHANOVA_MASTER",
        eventType: "YIELD_DEPOSITED_FIAT",
        payload: { vaultId: vault.id, propertyId, amountUsd },
        simulated: process.env.DEMO_MODE === 'true',
      });
    });

    return NextResponse.json({ success: true, message: `Successfully injected ${amountUsd} USD to Vault.` });
  } catch (error: any) {
    console.error("[yield inject error]", error);
    return NextResponse.json({ error: error.message || "Failed to inject yield" }, { status: 500 });
  }
}
