import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, and } from 'drizzle-orm';
import { validateDemoDatabaseUrl } from '@pachanova/database/src/utils/demoValidation';

const bodySchema = z.object({
  orderId: z.string().uuid(),
  investorId: z.string().uuid(),
});

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') return NextResponse.json({ error: 'DEMO_MODE=true required' }, { status: 403 });
    validateDemoDatabaseUrl(process.env.DATABASE_URL || '');

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid parameters', details: result.error }, { status: 400 });

    const { orderId, investorId } = result.data;

    await db.transaction(async (tx) => {
      // 1. Fetch order
      const order = await tx.query.p2pOrders.findFirst({
        where: and(
          eq(schema.p2pOrders.id, orderId),
          eq(schema.p2pOrders.sellerInvestorId, investorId)
        )
      });

      if (!order || order.status !== 'open') {
        throw new Error('Orden no disponible o no te pertenece');
      }

      // 2. Fetch seller balance
      const sellerBalance = await tx.query.balances.findFirst({
        where: eq(schema.balances.investorId, investorId)
      });

      if (!sellerBalance) {
        throw new Error('Balance no encontrado');
      }

      // 3. Update order status to cancelled
      await tx.update(schema.p2pOrders)
        .set({
          status: 'cancelled',
          updatedAt: new Date()
        })
        .where(eq(schema.p2pOrders.id, orderId));

      // 4. Refund tokens: available += quantity, locked -= quantity
      const refundQuantity = Number(order.quantity);
      const newAvailable = (Number(sellerBalance.availableTokens || 0) + refundQuantity).toString();
      const newLocked = (Number(sellerBalance.lockedTokens || 0) - refundQuantity).toString();

      await tx.update(schema.balances)
        .set({
          availableTokens: newAvailable,
          lockedTokens: newLocked,
          updatedAt: new Date()
        })
        .where(eq(schema.balances.investorId, investorId));

      // 5. Insert audit logs
      await tx.insert(schema.auditLogs).values({
        action: 'P2P_ORDER_CANCELLED',
        details: `Investor ${investorId} cancelled order ${orderId}`,
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("P2P cancel error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
