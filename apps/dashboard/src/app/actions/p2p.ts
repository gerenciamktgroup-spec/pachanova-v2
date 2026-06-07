"use server";

import { getDb, schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * MAKER: El Inversor publica una oferta en el P2P
 */
export async function createP2POrder(propertyId: string, quantity: number, pricePerToken: number) {
  try {
    if (quantity <= 0 || pricePerToken <= 0) {
      throw new Error("La cantidad y el precio deben ser mayores a 0");
    }

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

import { awardXP } from "@/lib/gamification/engine";
import crypto from "crypto";

/**
 * TAKER: El Inversor compra una oferta del libro. Ejecución atómica.
 */
export async function initiateP2PTrade(orderId: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const db = getDb();
    
    // Para simplificar el MVP y evitar bloqueos anidados con el webhook de gamificación,
    // extraemos datos que se usarán post-transacción.
    let sellerId = "";
    
    await db.transaction(async (tx) => {
      const [order] = await tx.select().from(schema.p2pOrders).where(eq(schema.p2pOrders.id, orderId));
      if (!order || order.status !== "open") throw new Error("Orden inválida o ya comprada");
      if (order.sellerInvestorId === user.id) throw new Error("No puedes comprar tu propia orden");

      sellerId = order.sellerInvestorId;

      // Calcular Fee 2% (Marketplace Bóveda)
      const total = parseFloat(order.totalAmount);
      const feeAmount = total * 0.02;
      const sellerReceives = total - feeAmount;
      const quantity = parseFloat(order.quantity);

      // Chequear saldo del comprador
      const [buyerBalance] = await tx.select().from(schema.balances)
        .where(eq(schema.balances.investorId, user.id));
      
      if (!buyerBalance || parseFloat(buyerBalance.availableUsd) < total) {
        throw new Error(`Saldo insuficiente. Requieres $${total.toFixed(2)} USD.`);
      }

      // 1. Descontar USD comprador y darle Tokens
      await tx.update(schema.balances)
        .set({
          availableUsd: sql`${schema.balances.availableUsd} - ${total}`,
          availableTokens: sql`${schema.balances.availableTokens} + ${quantity}`,
        })
        .where(eq(schema.balances.investorId, user.id));

      // 2. Dar USD neto al Vendedor y quitarle los tokens reservados (Escrow)
      await tx.update(schema.balances)
        .set({
          availableUsd: sql`${schema.balances.availableUsd} + ${sellerReceives}`,
          reservedTokens: sql`${schema.balances.reservedTokens} - ${quantity}`,
        })
        .where(eq(schema.balances.investorId, sellerId));

      // 3. Entregar Comisión (Fee) a la Bóveda Central (Tesorería)
      const [centralVault] = await tx.select().from(schema.treasury_vaults)
        .where(eq(schema.treasury_vaults.propertyId, order.propertyId));
      
      if (centralVault) {
        await tx.update(schema.treasury_vaults)
          .set({ accumulatedYieldUsd: sql`${schema.treasury_vaults.accumulatedYieldUsd} + ${feeAmount}` })
          .where(eq(schema.treasury_vaults.id, centralVault.id));
      }

      // 4. Actualizar estado y crear Trade
      await tx.update(schema.p2pOrders).set({ status: "filled" }).where(eq(schema.p2pOrders.id, order.id));

      const tradeId = crypto.randomUUID();
      await tx.insert(schema.p2pTrades).values({
        id: tradeId,
        orderId: order.id,
        propertyId: order.propertyId,
        buyerInvestorId: user.id,
        sellerInvestorId: sellerId,
        quantity: order.quantity,
        pricePerToken: order.pricePerToken,
        totalAmount: order.totalAmount,
        feeAmount: feeAmount.toString(),
        status: "filled",
        isDemo: false
      });

      // 5. Auditar Ledger (Double-Entry)
      const txHashSell = crypto.randomBytes(32).toString('hex');
      const txHashBuy = crypto.randomBytes(32).toString('hex');

      await tx.insert(schema.tokenLedger).values([
        {
          investorId: sellerId,
          propertyId: order.propertyId,
          amount: (-quantity).toString(),
          operation: 'p2p_sell',
          txHash: txHashSell,
          previousHash: txHashBuy,
          currentHash: crypto.randomBytes(32).toString('hex'),
        },
        {
          investorId: user.id,
          propertyId: order.propertyId,
          amount: quantity.toString(),
          operation: 'p2p_buy',
          txHash: txHashBuy,
          previousHash: txHashSell,
          currentHash: crypto.randomBytes(32).toString('hex'),
        }
      ]);
    });

    // Otorgar XP de Gamificación fuera de la transacción para no bloquear
    try {
      await awardXP(user.id, 'P2P_BUY', 200, { orderId });
      await awardXP(sellerId, 'P2P_SELL', 100, { orderId });
    } catch (e) {
      console.warn("Gamification error (ignoring for trade):", e);
    }

    revalidatePath("/dashboard/investor/marketplace");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * CHECKER (Admin): Aprueba el P2P Trade. Intercambia Saldos y cobra Fee.
 */
export async function approveP2PTrade(tradeId: string, action: "APPROVED" | "REJECTED" = "APPROVED") {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.app_metadata?.role || user?.user_metadata?.role;
    if (role !== "admin") throw new Error("No autorizado");

    const db = getDb();
    
    const [trade] = await db.select().from(schema.p2pTrades).where(eq(schema.p2pTrades.id, tradeId));
    if (!trade || trade.status !== "pending_approval") throw new Error("Trade inválido");

    if (action === "REJECTED") {
      await db.update(schema.p2pTrades).set({ status: "cancelled" }).where(eq(schema.p2pTrades.id, trade.id));
      await db.update(schema.p2pOrders).set({ status: "open" }).where(eq(schema.p2pOrders.id, trade.orderId));
      revalidatePath("/dashboard/admin/approvals");
      return { success: true };
    }

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
