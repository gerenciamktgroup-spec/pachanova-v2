import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, isStaff } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getSession();
  const body = await req.json();
  if (body.action === "reconcile") {
    if (session && !isStaff(session.role)) return NextResponse.json({ error: "Solo admin" }, { status: 403 });
    const [payment] = await db.update(core.clientPayments).set({ status: "reconciled", paidAt: new Date() }).where(eq(core.clientPayments.id, body.paymentId)).returning();
    if (payment) await db.update(core.clientOrders).set({ status: "paying", updatedAt: new Date() }).where(eq(core.clientOrders.id, payment.orderId));
    return NextResponse.json({ payment });
  }
  if (!session) return NextResponse.json({ error: "Sesión requerida" }, { status: 401 });
  const [payment] = await db.insert(core.clientPayments).values({
    orderId: body.orderId,
    amount: String(body.amount),
    kind: "down_payment",
    status: "pending",
    method: "manual",
  }).returning();
  return NextResponse.json({ payment }, { status: 201 });
}
