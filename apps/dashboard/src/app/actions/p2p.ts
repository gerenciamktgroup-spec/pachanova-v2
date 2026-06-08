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
    
    let sellerId = "";
    
    await db.transaction(async (tx) => {
      const [order] = await tx.select().from(schema.p2pOrders).where(eq(schema.p2pOrders.id, orderId));
      if (!order || order.status !== "open") throw new Error("Orden inválida o ya está en negociación");
      if (order.sellerInvestorId === user.id) throw new Error("No puedes negociar tu propia orden");

      sellerId = order.sellerInvestorId;

      // Calcular Fee 5% (PachaNova Escrow Fee)
      const total = parseFloat(order.totalAmount);
      const feeAmount = total * 0.05;
      const quantity = parseFloat(order.quantity);

      // 1. Bloquear Tokens del Vendedor (Mover de available a reserved)
      const [sellerBalance] = await tx.select().from(schema.balances)
        .where(and(eq(schema.balances.investorId, sellerId), eq(schema.balances.propertyId, order.propertyId)));
      
      if (!sellerBalance || parseFloat(sellerBalance.availableTokens) < quantity) {
        throw new Error("El vendedor ya no tiene los tokens disponibles.");
      }

      await tx.update(schema.balances)
        .set({
          availableTokens: sql`${schema.balances.availableTokens} - ${quantity}`,
          reservedTokens: sql`${schema.balances.reservedTokens} + ${quantity}`,
        })
        .where(eq(schema.balances.id, sellerBalance.id));

      // 2. Actualizar estado de la Orden
      await tx.update(schema.p2pOrders).set({ status: "pending_approval" }).where(eq(schema.p2pOrders.id, order.id));

      // 3. Crear Trade en pending_approval (Off-Platform Fiat)
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
        status: "pending_approval",
        isDemo: false
      });
    });

    try {
      await awardXP(user.id, 'P2P_BUY', 50, { orderId });
    } catch (e) {
      console.warn("Gamification error:", e);
    }

    revalidatePath("/dashboard/investor/marketplace");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveP2PTrade(tradeId: string, action: "APPROVED" | "REJECTED" = "APPROVED") {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.app_metadata?.role || user?.user_metadata?.role;
    if (role !== "admin") throw new Error("No autorizado");

    const db = getDb();
    
    await db.transaction(async (tx) => {
      const [trade] = await tx.select().from(schema.p2pTrades).where(eq(schema.p2pTrades.id, tradeId));
      if (!trade || trade.status !== "pending_approval") throw new Error("Trade inválido");

      const quantity = parseFloat(trade.quantity);

      if (action === "REJECTED") {
        // Devolver tokens bloqueados al vendedor
        const [sellerBalance] = await tx.select().from(schema.balances)
          .where(and(eq(schema.balances.investorId, trade.sellerInvestorId), eq(schema.balances.propertyId, trade.propertyId)));

        if (sellerBalance) {
           await tx.update(schema.balances)
             .set({
               availableTokens: sql`${schema.balances.availableTokens} + ${quantity}`,
               reservedTokens: sql`${schema.balances.reservedTokens} - ${quantity}`,
             })
             .where(eq(schema.balances.id, sellerBalance.id));
        }

        await tx.update(schema.p2pTrades).set({ status: "cancelled" }).where(eq(schema.p2pTrades.id, trade.id));
        await tx.update(schema.p2pOrders).set({ status: "open" }).where(eq(schema.p2pOrders.id, trade.orderId));
        return;
      }

      // ACCIÓN = APPROVED (El Admin validó el pago Fiat Off-Platform)

      // 1. Quitar Tokens Reservados al Vendedor
      const [sellerBalance] = await tx.select().from(schema.balances)
          .where(and(eq(schema.balances.investorId, trade.sellerInvestorId), eq(schema.balances.propertyId, trade.propertyId)));
      
      if (sellerBalance) {
         await tx.update(schema.balances)
           .set({ reservedTokens: sql`${schema.balances.reservedTokens} - ${quantity}` })
           .where(eq(schema.balances.id, sellerBalance.id));
      }

      // 2. Dar Tokens al Comprador
      const [buyerBalance] = await tx.select().from(schema.balances)
          .where(and(eq(schema.balances.investorId, trade.buyerInvestorId), eq(schema.balances.propertyId, trade.propertyId)));

      if (buyerBalance) {
        await tx.update(schema.balances)
          .set({ availableTokens: sql`${schema.balances.availableTokens} + ${quantity}` })
          .where(eq(schema.balances.id, buyerBalance.id));
      } else {
        await tx.insert(schema.balances).values({
          investorId: trade.buyerInvestorId,
          propertyId: trade.propertyId,
          availableTokens: quantity.toString(),
          availableUsd: "0",
          lockedTokens: "0"
        });
      }

      // 3. Registrar Fee del 5% en la Bóveda Central (Tesorería) para contabilidad
      // Nota: El cobro real en fiat se realiza administrativamente, aquí solo se refleja en el dashboard.
      const [centralVault] = await tx.select().from(schema.treasury_vaults)
        .where(eq(schema.treasury_vaults.propertyId, trade.propertyId));
      
      if (centralVault) {
        await tx.update(schema.treasury_vaults)
          .set({ accumulatedYieldUsd: sql`${schema.treasury_vaults.accumulatedYieldUsd} + ${trade.feeAmount}` })
          .where(eq(schema.treasury_vaults.id, centralVault.id));
      }

      // 4. Actualizar Estado
      await tx.update(schema.p2pTrades).set({ status: "filled" }).where(eq(schema.p2pTrades.id, trade.id));
      await tx.update(schema.p2pOrders).set({ status: "filled" }).where(eq(schema.p2pOrders.id, trade.orderId));

      // 5. Auditar Ledger (Double-Entry)
      const txHashSell = crypto.randomBytes(32).toString('hex');
      const txHashBuy = crypto.randomBytes(32).toString('hex');

      await tx.insert(schema.tokenLedger).values([
        {
          investorId: trade.sellerInvestorId,
          propertyId: trade.propertyId,
          amount: (-quantity).toString(),
          operation: 'p2p_sell',
          txHash: txHashSell,
          previousHash: txHashBuy,
          currentHash: crypto.randomBytes(32).toString('hex'),
        },
        {
          investorId: trade.buyerInvestorId,
          propertyId: trade.propertyId,
          amount: quantity.toString(),
          operation: 'p2p_buy',
          txHash: txHashBuy,
          previousHash: txHashSell,
          currentHash: crypto.randomBytes(32).toString('hex'),
        }
      ]);
    });

    try {
      // El vendedor gana su XP en la confirmación real
      const [tradeData] = await getDb().select().from(schema.p2pTrades).where(eq(schema.p2pTrades.id, tradeId));
      await awardXP(tradeData.sellerInvestorId, 'P2P_SELL', 100, { tradeId });
    } catch (e) {}

    revalidatePath("/dashboard/admin/approvals");
    return { success: true };
  } catch (error: any) {
    console.error("Approve P2P Error:", error);
    return { success: false, error: error.message };
  }
}
