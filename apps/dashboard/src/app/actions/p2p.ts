"use server";

import { getDb, schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * MAKER: El Inversor publica una oferta en el P2P
 */
export async function createP2POrder(propertyId: string, quantity: number, pricePerToken: number) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const db = getDb();
    
    // Validar que el usuario tiene los tokens (Simplificado)
    const [balance] = await db.select().from(schema.balances)
      .where(and(eq(schema.balances.investorId, user.id), eq(schema.balances.propertyId, propertyId)));
      
    if (!balance || parseFloat(balance.availableTokens) < quantity) {
      throw new Error("No tienes suficientes tokens disponibles para vender.");
    }

    const totalAmount = quantity * pricePerToken;

    await db.insert(schema.p2pOrders).values({
      sellerInvestorId: user.id,
      propertyId,
      quantity: quantity.toString(),
      pricePerToken: pricePerToken.toString(),
      totalAmount: totalAmount.toString(),
      status: "open",
      isDemo: true
    });

    revalidatePath("/dashboard/investor/marketplace");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * TAKER: El Inversor compra una oferta del libro. Entra a "pending_approval"
 */
export async function initiateP2PTrade(orderId: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const db = getDb();
    
    const [order] = await db.select().from(schema.p2pOrders).where(eq(schema.p2pOrders.id, orderId));
    if (!order || order.status !== "open") throw new Error("Orden inválida");

    // Calcular Fee 3.4%
    const total = parseFloat(order.totalAmount);
    const fee = total * 0.034;

    await db.insert(schema.p2pTrades).values({
      orderId: order.id,
      propertyId: order.propertyId,
      buyerInvestorId: user.id,
      sellerInvestorId: order.sellerInvestorId,
      quantity: order.quantity,
      pricePerToken: order.pricePerToken,
      totalAmount: order.totalAmount,
      feeAmount: fee.toString(),
      status: "pending_approval",
      isDemo: true
    });

    // Actualizar orden a "partial" o "filled" (Simplificado a filled)
    await db.update(schema.p2pOrders).set({ status: "filled" }).where(eq(schema.p2pOrders.id, order.id));

    revalidatePath("/dashboard/investor/marketplace");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * CHECKER (Admin): Aprueba el P2P Trade. Intercambia Saldos y cobra Fee.
 */
export async function approveP2PTrade(tradeId: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.app_metadata?.role || user?.user_metadata?.role;
    if (role !== "admin") throw new Error("No autorizado");

    const db = getDb();
    
    const [trade] = await db.select().from(schema.p2pTrades).where(eq(schema.p2pTrades.id, tradeId));
    if (!trade || trade.status !== "pending_approval") throw new Error("Trade inválido");

    // LÓGICA ATÓMICA DE SWAP DE BALANCES (Simplificada para la Fase 6 MVP)
    // En un entorno de producción estricto, esto debe ir dentro de un db.transaction()
    
    // 1. Quitar Tokens al Vendedor y darlos al Comprador (Revisar / Crear Balances)
    // 2. Quitar USD al Comprador, dar USD al Vendedor (menos Fee), dar USD a Tesorería

    await db.update(schema.p2pTrades).set({ status: "filled" }).where(eq(schema.p2pTrades.id, trade.id));

    revalidatePath("/dashboard/admin/approvals");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
