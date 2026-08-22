import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";
import { getSession, isStaff } from "@/lib/session";
import { projectByCode } from "@/lib/projects";

export async function POST(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const session = await getSession();
  const { code } = await ctx.params;
  const project = await projectByCode(code);
  if (!project) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const body = await req.json();
  const action = String(body.action || "contribute");

  if (action === "reconcile") {
    if (session && !isStaff(session.role)) return NextResponse.json({ error: "Solo admin" }, { status: 403 });
    const [tx] = await db.update(core.capitalTransactions).set({
      status: "reconciled",
      reconciledBy: session?.id,
      reconciledAt: new Date(),
    }).where(eq(core.capitalTransactions.id, body.transactionId)).returning();
    if (tx?.participationId) {
      await db.update(core.participations).set({
        paidAmount: sql`${core.participations.paidAmount} + ${tx.amount}`,
        status: "active",
        updatedAt: new Date(),
      }).where(eq(core.participations.id, tx.participationId));
    }
    await db.update(core.projects).set({
      raisedCapital: sql`${core.projects.raisedCapital} + ${tx.amount}`,
      updatedAt: new Date(),
    }).where(eq(core.projects.id, project.id));
    await db.insert(core.auditEvents).values({ actorId: session?.id, action: "capital.reconcile", entityType: "capital_transaction", entityId: tx.id, payload: {} });
    return NextResponse.json({ transaction: tx });
  }

  if (session && session.role !== "investor" && !isStaff(session.role)) {
    return NextResponse.json({ error: "Solo inversor" }, { status: 403 });
  }
  if (project.roundStatus !== "open" && !isStaff(session?.role)) {
    return NextResponse.json({ error: "La ronda no está abierta" }, { status: 409 });
  }
  const amount = Number(body.amount);
  if (!amount || amount <= 0) return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
  if (!session?.email) return NextResponse.json({ error: "Sesión requerida" }, { status: 401 });
  const [investor] = await db.select().from(core.profiles).where(eq(core.profiles.email, session.email)).limit(1);
  if (!investor) return NextResponse.json({ error: "Inversor no encontrado" }, { status: 404 });
  if (investor.kycStatus !== "approved" && !isStaff(session.role)) {
    return NextResponse.json({ error: "Primero completá la verificación de identidad" }, { status: 403 });
  }
  const existing = await db.select().from(core.participations).where(and(eq(core.participations.projectId, project.id), eq(core.participations.investorId, investor.id))).limit(1);
  let participation = existing[0];
  if (!participation) {
    const [created] = await db.insert(core.participations).values({
      projectId: project.id, investorId: investor.id, committedAmount: String(amount), paidAmount: "0", status: "committed",
    }).returning();
    participation = created;
  } else {
    const [updated] = await db.update(core.participations).set({
      committedAmount: sql`${core.participations.committedAmount} + ${amount}`,
      status: "committed",
      updatedAt: new Date(),
    }).where(eq(core.participations.id, participation.id)).returning();
    participation = updated;
  }
  const [transaction] = await db.insert(core.capitalTransactions).values({
    projectId: project.id,
    participationId: participation.id,
    profileId: investor.id,
    kind: "contribution",
    amount: String(amount),
    status: "pending",
    method: "manual",
  }).returning();
  await db.insert(core.auditEvents).values({ actorId: session.id, action: "capital.contribute", entityType: "capital_transaction", entityId: transaction.id, payload: { amount } });
  return NextResponse.json({ participation, transaction }, { status: 201 });
}
