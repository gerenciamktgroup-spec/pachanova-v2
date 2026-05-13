import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { assertSafeDemoAction } from "./demoActionGuards";
import { logDemoAuditEvent } from "./auditEvent";
import { logDemoIntegrationEvent } from "./integrationEvent";

export async function executeInvestorGenesisAttempt(investorId: string, tokenAmount: number) {
  assertSafeDemoAction();

  const usdPricePerToken = 8.40;
  const totalUsdAmount = tokenAmount * usdPricePerToken;

  return await db.transaction(async (tx) => {
    // 0. Ensure we have a valid investor ID from the database for foreign key constraint
    const firstInvestor = await tx.query.investors.findFirst();
    const validInvestorId = firstInvestor?.id || investorId;

    // 1. Create a token order in pending_demo state
    const [purchase] = await tx.insert(schema.genesisPurchases).values({
      investorId: validInvestorId,
      tokenAmount: tokenAmount.toString(),
      totalUsdAmount: totalUsdAmount.toString(),
      usdPricePerToken: usdPricePerToken.toString(),
      status: "pending_demo",
    }).returning({ id: schema.genesisPurchases.id });

    // 2. Insert Integration Event
    await logDemoIntegrationEvent(
      "MERCADOPAGO",
      "CHECKOUT_INITIALIZED",
      "PENDING_CREDENTIALS",
      { genesisPurchaseId: purchase.id, amount: totalUsdAmount }
    );

    // 3. Insert Audit Log
    await logDemoAuditEvent(
      "GENESIS_ATTEMPT",
      `Simulated attempt to purchase ${tokenAmount} PACHA for $${totalUsdAmount}`,
      validInvestorId
    );

    return {
      ok: true,
      status: "PENDING_CREDENTIALS",
      message: "Intento demo registrado. MercadoPago permanece pendiente de credenciales.",
      simulated: true,
      purchaseId: purchase.id
    };
  });
}
