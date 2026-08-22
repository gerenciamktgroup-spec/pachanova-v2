import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { eq } from "drizzle-orm";
import { getSessionUser, isAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    const body = await req.json();
    const action = String(body.action || "pay");

    if (action === "reconcile") {
      if (session && !isAdmin(session.role)) {
        return NextResponse.json({ error: "Solo admin concilia" }, { status: 403 });
      }
      if (!body.paymentId) return NextResponse.json({ error: "paymentId obligatorio" }, { status: 400 });
      const [payment] = await db
        .update(core.clientPayments)
        .set({ status: "reconciled", paidAt: new Date() })
        .where(eq(core.clientPayments.id, body.paymentId))
        .returning();

      if (payment) {
        await db
          .update(core.clientOrders)
          .set({ status: "paying", updatedAt: new Date() })
          .where(eq(core.clientOrders.id, payment.orderId));
      }

      await db.insert(core.auditEvents).values({
        actorId: session?.id,
        action: "client_payment.reconcile",
        entityType: "client_payment",
        entityId: body.paymentId,
        payload: {},
      });
      return NextResponse.json({ payment });
    }

    if (session && session.role !== "client" && !isAdmin(session.role)) {
      return NextResponse.json({ error: "Solo cliente" }, { status: 403 });
    }
    if (!body.orderId || !body.amount) {
      return NextResponse.json({ error: "orderId y amount obligatorios" }, { status: 400 });
    }

    const [payment] = await db
      .insert(core.clientPayments)
      .values({
        orderId: body.orderId,
        amount: String(body.amount),
        kind: String(body.kind || "down_payment"),
        status: "pending",
        method: "manual",
      })
      .returning();

    await db.insert(core.auditEvents).values({
      actorId: session?.id,
      action: "client_payment.create",
      entityType: "client_payment",
      entityId: payment.id,
      payload: { amount: body.amount },
    });

    return NextResponse.json({ payment }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
