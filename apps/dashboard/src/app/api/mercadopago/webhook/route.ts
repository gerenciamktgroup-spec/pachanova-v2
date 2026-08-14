import { createHash, randomUUID } from "crypto";

import { schema } from "@pachanova/database";
import { createIntegrationRegistry, MercadoPagoSandboxProvider } from "@pachanova/integrations";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/server/db";

const webhookSchema = z.object({
  type: z.string().optional(),
  action: z.string().optional(),
  data: z.object({
    id: z.union([z.string(), z.number()]),
    status: z.string().optional(),
    external_reference: z.string().optional(),
    transaction_amount: z.number().optional(),
    currency_id: z.string().optional(),
  }).passthrough(),
}).passthrough();

type IntegrationEvent = typeof schema.integrationEvents.$inferInsert;

async function recordEvent(event: IntegrationEvent) {
  try {
    await db.insert(schema.integrationEvents).values(event);
  } catch (error) {
    console.warn(`Webhook event ${event.eventType} could not be persisted`, error);
  }
}

function hashedReference(namespace: string, value: string) {
  return `0x${createHash("sha256").update(`${namespace}:${value}`).digest("hex")}`;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let rawPayload: unknown;
    try {
      rawPayload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
    }

    const parsed = webhookSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid webhook payload" }, { status: 400 });
    }

    const body = parsed.data;
    const headersRecord = Object.fromEntries(request.headers.entries());
    const registry = createIntegrationRegistry();
    const paymentsStatus = registry.getStatus("payments");

    if (paymentsStatus.status === "DISABLED") {
      return NextResponse.json({ success: false, error: "Payments are disabled" }, { status: 400 });
    }

    const isSandbox = process.env.DEMO_PROFILE === "sandbox";
    const allowUnsigned = !isSandbox && process.env.MP_WEBHOOK_ALLOW_UNSIGNED === "true";
    const provider = new MercadoPagoSandboxProvider(
      process.env.MERCADOPAGO_ACCESS_TOKEN || "",
      process.env.MERCADOPAGO_WEBHOOK_SECRET || "",
      allowUnsigned,
    );

    const requestId = headersRecord["x-request-id"];
    const hasSignature = Boolean(headersRecord["x-signature"]);
    if (isSandbox && (!hasSignature || !requestId)) {
      await recordEvent({
        provider: "MERCADOPAGO",
        eventType: "WEBHOOK_SIGNATURE_INVALID",
        payload: { requestId: requestId || null, hasSignature, reason: "missing_headers" },
        simulated: paymentsStatus.simulated,
      });
      return NextResponse.json({ success: false, error: "Missing signature headers" }, { status: 401 });
    }

    if (!provider.verifyWebhookSignature(headersRecord, rawBody)) {
      await recordEvent({
        provider: "MERCADOPAGO",
        eventType: "WEBHOOK_SIGNATURE_INVALID",
        payload: { requestId: requestId || null, hasSignature, reason: "signature_mismatch" },
        simulated: paymentsStatus.simulated,
      });
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
    }

    await recordEvent({
      provider: "MERCADOPAGO",
      eventType: "WEBHOOK_RECEIVED",
      payload: body,
      simulated: paymentsStatus.simulated,
    });

    if (body.type !== "payment" && !body.action?.startsWith("payment.")) {
      return NextResponse.json({ success: true, received: true });
    }

    const paymentId = String(body.data.id);
    let status = body.data.status || "approved";
    let externalReference = body.data.external_reference || "";
    let transactionAmount = body.data.transaction_amount || 0;
    let currency = body.data.currency_id || process.env.MERCADOPAGO_CURRENCY || "USD";
    const expectedCurrency = process.env.MERCADOPAGO_CURRENCY || "USD";

    if (isSandbox) {
      try {
        const details = await provider.getPaymentDetails(paymentId);
        status = details.status || "pending";
        externalReference = details.external_reference || "";
        transactionAmount = details.transaction_amount || 0;
        currency = details.currency_id || expectedCurrency;
      } catch (error) {
        console.error("MercadoPago payment verification failed", error);
        return NextResponse.json({ success: false, error: "Failed to verify payment with MercadoPago" }, { status: 502 });
      }
    }

    if (status !== "approved") {
      await recordEvent({ provider: "MERCADOPAGO", eventType: "PAYMENT_REJECTED", payload: { paymentId, status }, simulated: paymentsStatus.simulated });
      return NextResponse.json({ success: true, message: `Payment ${status}` });
    }

    if (!externalReference) {
      return NextResponse.json({ success: false, error: "Missing external_reference" }, { status: 400 });
    }
    if (currency !== expectedCurrency) {
      await recordEvent({ provider: "MERCADOPAGO", eventType: "PAYMENT_CURRENCY_MISMATCH", payload: { paymentId, currency, expectedCurrency }, simulated: paymentsStatus.simulated });
      return NextResponse.json({ success: false, error: "Currency mismatch" }, { status: 400 });
    }
    if (!z.string().uuid().safeParse(externalReference).success) {
      return NextResponse.json({ success: false, error: "Unknown orderId" }, { status: 404 });
    }

    const existingPurchase = await db.query.genesisPurchases.findFirst({
      where: eq(schema.genesisPurchases.paymentReference, paymentId),
    });
    if (existingPurchase) {
      await recordEvent({ provider: "MERCADOPAGO", eventType: "PAYMENT_DUPLICATE", payload: { paymentId }, simulated: paymentsStatus.simulated });
      return NextResponse.json({ success: true, message: "idempotent_duplicate" });
    }

    const order = await db.query.tokenOrders.findFirst({ where: eq(schema.tokenOrders.id, externalReference) });
    if (!order) return NextResponse.json({ success: false, error: "Unknown orderId" }, { status: 404 });
    if (order.status !== "pending") return NextResponse.json({ success: false, error: "Order not pending" }, { status: 400 });
    if (Math.abs(Number(order.totalAmount) - transactionAmount) > 0.01) {
      return NextResponse.json({ success: false, error: "Amount mismatch" }, { status: 400 });
    }

    const investor = await db.query.investors.findFirst({ where: eq(schema.investors.id, order.investorId) });
    if (!investor || investor.kycStatus !== "approved") {
      return NextResponse.json({ success: false, error: "User KYC is not approved" }, { status: 403 });
    }

    const result = await db.transaction(async (tx) => {
      const [purchase] = await tx.insert(schema.genesisPurchases).values({
        investorId: investor.id,
        tokenAmount: order.quantity,
        usdPricePerToken: order.unitPrice,
        totalUsdAmount: order.totalAmount,
        status: "completed",
        paymentReference: paymentId,
      }).onConflictDoNothing({ target: schema.genesisPurchases.paymentReference }).returning({ id: schema.genesisPurchases.id });

      if (!purchase) return { duplicate: true } as const;

      const [completedOrder] = await tx.update(schema.tokenOrders)
        .set({ status: "completed", mpPaymentId: paymentId, updatedAt: new Date() })
        .where(and(eq(schema.tokenOrders.id, order.id), eq(schema.tokenOrders.status, "pending")))
        .returning({ id: schema.tokenOrders.id });
      if (!completedOrder) throw new Error("Order was processed concurrently");

      const latestLedger = await tx.query.tokenLedger.findFirst({
        where: eq(schema.tokenLedger.investorId, investor.id),
        orderBy: [desc(schema.tokenLedger.timestamp)],
      });
      const previousHash = latestLedger?.currentHash ?? "0x0000000000000000000000000000000000000000000000000000000000000000";
      const timestamp = new Date();
      const txHash = hashedReference("mercadopago", paymentId);
      const currentHash = hashedReference("ledger", `${previousHash}:mint:${investor.id}:${order.quantity}:${timestamp.toISOString()}:${randomUUID()}`);

      await tx.insert(schema.tokenLedger).values({ investorId: investor.id, amount: order.quantity, operation: "mint", previousHash, currentHash, txHash, timestamp });
      await tx.insert(schema.balances)
        .values({ investorId: investor.id, availableTokens: order.quantity, lastUpdatedAt: timestamp })
        .onConflictDoUpdate({
          target: schema.balances.investorId,
          set: { availableTokens: sql`${schema.balances.availableTokens} + ${Number(order.quantity)}`, lastUpdatedAt: timestamp },
        });
      await tx.insert(schema.auditLogs).values({ action: "MERCADOPAGO_PAYMENT_APPROVED", details: `Pago ${paymentId} acreditó ${order.quantity} PACHA`, userId: investor.id });
      await tx.insert(schema.integrationEvents).values({ provider: "MERCADOPAGO", eventType: "PAYMENT_APPROVED", payload: { paymentId, orderId: order.id, investorId: investor.id }, txHash, simulated: paymentsStatus.simulated });

      return { duplicate: false, txHash } as const;
    });

    if (result.duplicate) {
      return NextResponse.json({ success: true, message: "idempotent_duplicate" });
    }
    return NextResponse.json({ success: true, message: "payment_credited", txHash: result.txHash });
  } catch (error) {
    console.error("Webhook error", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Internal error" }, { status: 500 });
  }
}
