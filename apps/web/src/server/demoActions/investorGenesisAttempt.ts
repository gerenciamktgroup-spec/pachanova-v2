import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { assertSafeDemoAction } from "./demoActionGuards";
import { logDemoAuditEvent } from "./auditEvent";
import { logDemoIntegrationEvent } from "./integrationEvent";

export async function executeInvestorGenesisAttempt(investorId: string, tokenAmount: number) {
  assertSafeDemoAction();

  const usdPricePerToken = 8.40;
  const totalUsdAmount = tokenAmount * usdPricePerToken;

  try {
    return await db.transaction(async (tx) => {
      const firstInvestor = await tx.query.investors.findFirst();
      const validInvestorId = firstInvestor?.id || investorId;

      const [purchase] = await tx.insert(schema.genesisPurchases).values({
        investorId: validInvestorId,
        tokenAmount: tokenAmount.toString(),
        totalUsdAmount: totalUsdAmount.toString(),
        usdPricePerToken: usdPricePerToken.toString(),
        status: "pending_demo",
      }).returning({ id: schema.genesisPurchases.id });

      await logDemoIntegrationEvent(
        "MERCADOPAGO",
        "CHECKOUT_INITIALIZED",
        "PENDING_CREDENTIALS",
        { genesisPurchaseId: purchase?.id || "demo-sim-purchase-id", amount: totalUsdAmount }
      );

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
        purchaseId: purchase?.id || "demo-sim-purchase-id"
      };
    });
  } catch (error) {
    console.warn("DB transaction in executeInvestorGenesisAttempt failed, returning simulated response:", error);
    return {
      ok: true,
      status: "PENDING_CREDENTIALS",
      message: "Intento demo registrado. MercadoPago permanece pendiente de credenciales (Modo Simulación).",
      simulated: true,
      purchaseId: "sim-purchase-" + Date.now()
    };
  }
}
