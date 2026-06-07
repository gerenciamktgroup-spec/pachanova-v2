import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, sql } from 'drizzle-orm';
import { awardXP } from '@/lib/gamification/engine';
import { z } from 'zod';
import crypto from 'crypto';

const bodySchema = z.object({
  buyerInvestorId: z.string().uuid(),
  orderId: z.string().uuid(),
});

// Marketplace Trading Fee (2%)
const P2P_FEE_PCT = 0.02;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Parámetros inválidos', details: result.error }, { status: 400 });

    const { buyerInvestorId, orderId } = result.data;

    await db.transaction(async (tx) => {
      // 1. Validaciones del comprador
      const buyer = await tx.query.users.findFirst({ where: eq(schema.users.id, buyerInvestorId) });
      if (!buyer || buyer.kycStatus !== 'approved') {
        throw new Error('El comprador debe tener el KYC aprobado');
      }

      // 2. Fetch de la orden
      const order = await tx.query.p2pOrders.findFirst({ where: eq(schema.p2pOrders.id, orderId) });
      if (!order) throw new Error('Orden no encontrada');
      if (order.status !== 'open') throw new Error('La orden no está disponible para compra');
      if (order.sellerInvestorId === buyerInvestorId) throw new Error('No puedes comprar tu propia orden');

      const totalAmount = parseFloat(order.totalAmount);
      const quantity = parseFloat(order.quantity);
      
      const feeAmount = totalAmount * P2P_FEE_PCT;
      const sellerReceives = totalAmount - feeAmount;

      // 3. Chequear el balance del comprador
      const buyerBalance = await tx.query.balances.findFirst({ 
        where: eq(schema.balances.investorId, buyerInvestorId) 
      });

      // Validamos saldo general (asumimos que availableUsd puede usarse a nivel global, pero en esta v1 está en la fila de property)
      // Como simplificación, si le falta saldo explota.
      if (!buyerBalance || parseFloat(buyerBalance.availableUsd) < totalAmount) {
        throw new Error(`Saldo insuficiente. Requieres $${totalAmount.toFixed(2)} USD.`);
      }

      // 4. Intercambio Atómico (Atomic Swap)
      
      // A) Comprador: Paga Total, recibe Fracciones
      await tx.update(schema.balances)
        .set({
          availableUsd: sql`${schema.balances.availableUsd} - ${totalAmount}`,
          availableTokens: sql`${schema.balances.availableTokens} + ${quantity}`,
        })
        .where(eq(schema.balances.investorId, buyerInvestorId));

      // B) Vendedor: Pierde fracciones reservadas (Escrow), recibe USD netos
      await tx.update(schema.balances)
        .set({
          availableUsd: sql`${schema.balances.availableUsd} + ${sellerReceives}`,
          reservedTokens: sql`${schema.balances.reservedTokens} - ${quantity}`,
        })
        .where(eq(schema.balances.investorId, order.sellerInvestorId));

      // C) Bóveda Central (Tesorería): Recibe el Fee
      const centralVault = await tx.query.treasury_vaults.findFirst({
        where: eq(schema.treasury_vaults.propertyId, order.propertyId)
      });
      
      if (centralVault) {
        await tx.update(schema.treasury_vaults)
          .set({
            accumulatedYieldUsd: sql`${schema.treasury_vaults.accumulatedYieldUsd} + ${feeAmount}`
          })
          .where(eq(schema.treasury_vaults.id, centralVault.id));
      }

      // 5. Cerrar Orden y Crear Trade
      await tx.update(schema.p2pOrders)
        .set({ status: 'filled', updatedAt: new Date() })
        .where(eq(schema.p2pOrders.id, orderId));

      const tradeId = crypto.randomUUID();
      await tx.insert(schema.p2pTrades).values({
        id: tradeId,
        orderId: order.id,
        propertyId: order.propertyId,
        buyerInvestorId,
        sellerInvestorId: order.sellerInvestorId,
        quantity: quantity.toString(),
        pricePerToken: order.pricePerToken,
        totalAmount: totalAmount.toString(),
        feeAmount: feeAmount.toString(),
        status: 'filled',
        isDemo: false,
      });

      // 6. Double-Entry Ledger Inmutable
      const txHashSell = crypto.randomBytes(32).toString('hex');
      const txHashBuy = crypto.randomBytes(32).toString('hex');

      await tx.insert(schema.tokenLedger).values([
        {
          investorId: order.sellerInvestorId,
          propertyId: order.propertyId,
          amount: (-quantity).toString(),
          operation: 'p2p_sell',
          txHash: txHashSell,
          previousHash: txHashBuy, // chaining them conceptually for this trade
          currentHash: crypto.randomBytes(32).toString('hex'),
        },
        {
          investorId: buyerInvestorId,
          propertyId: order.propertyId,
          amount: quantity.toString(),
          operation: 'p2p_buy',
          txHash: txHashBuy,
          previousHash: txHashSell,
          currentHash: crypto.randomBytes(32).toString('hex'),
        }
      ]);

      // 7. Gamification Triggers
      // Damos XP a ambos usuarios por interactuar con el mercado secundario
      // await awardXP(buyerInvestorId, 'P2P_BUY', 200, { tradeId });
      // await awardXP(order.sellerInvestorId, 'P2P_SELL', 100, { tradeId });
      // Note: we would run awardXP but it does its own tx. We run it outside the block or adapt engine.ts
    });

    // Run gamification outside the main transaction to avoid nested tx conflicts if engine.ts uses db.transaction
    // Fetch order again without tx
    const orderData = await db.query.p2pOrders.findFirst({ where: eq(schema.p2pOrders.id, orderId) });
    if(orderData) {
        await awardXP(buyerInvestorId, 'P2P_BUY', 200, { orderId });
        await awardXP(orderData.sellerInvestorId, 'P2P_SELL', 100, { orderId });
    }

    return NextResponse.json({ success: true, message: `Compra P2P ejecutada exitosamente` });
  } catch (error) {
    console.error("[P2P Execute Engine]", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
