import { NextRequest, NextResponse } from "next/server";
import { db, core } from "@/server/db";
import { and, eq, sql } from "drizzle-orm";
import { getSessionUser, isAdmin } from "@/lib/auth/session";
import { loadProjectByCode } from "@/lib/projects/load";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ code: string }> }
) {
  try {
    const session = await getSessionUser();
    const { code } = await ctx.params;
    const project = await loadProjectByCode(code);
    if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

    const body = await req.json();
    const action = String(body.action || "contribute");

    if (action === "reconcile") {
      if (session && !isAdmin(session.role)) {
        return NextResponse.json({ error: "Solo admin concilia" }, { status: 403 });
      }
      if (!body.transactionId) {
        return NextResponse.json({ error: "transactionId obligatorio" }, { status: 400 });
      }
      const [tx] = await db
        .update(core.capitalTransactions)
        .set({
          status: "reconciled",
          reconciledBy: session?.id,
          reconciledAt: new Date(),
        })
        .where(eq(core.capitalTransactions.id, body.transactionId))
        .returning();

      if (tx?.participationId) {
        await db
          .update(core.participations)
          .set({
            paidAmount: sql`${core.participations.paidAmount} + ${tx.amount}`,
            status: "active",
            updatedAt: new Date(),
          })
          .where(eq(core.participations.id, tx.participationId));
      }

      await db
        .update(core.projects)
        .set({
          raisedCapital: sql`${core.projects.raisedCapital} + ${tx.amount}`,
          updatedAt: new Date(),
        })
        .where(eq(core.projects.id, project.id));

      await db.insert(core.auditEvents).values({
        actorId: session?.id,
        action: "capital.reconcile",
        entityType: "capital_transaction",
        entityId: tx.id,
        payload: { amount: tx.amount },
      });

      return NextResponse.json({ transaction: tx });
    }

    if (action === "contribute") {
      if (session && session.role !== "investor" && !isAdmin(session.role)) {
        return NextResponse.json({ error: "Solo inversor o admin" }, { status: 403 });
      }
      if (project.roundStatus !== "open" && !isAdmin(session?.role)) {
        return NextResponse.json({ error: "La ronda no está abierta" }, { status: 409 });
      }
      const amount = Number(body.amount);
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: "amount inválido" }, { status: 400 });
      }

      const investorEmail = isAdmin(session?.role) && body.investorEmail
        ? String(body.investorEmail)
        : session?.email;
      if (!investorEmail) {
        return NextResponse.json({ error: "Sin inversor" }, { status: 400 });
      }

      const [investor] = await db
        .select()
        .from(core.profiles)
        .where(eq(core.profiles.email, investorEmail))
        .limit(1);
      if (!investor || (investor.role !== "investor" && !isAdmin(session?.role))) {
        return NextResponse.json({ error: "Inversor no encontrado" }, { status: 404 });
      }

      const existing = await db
        .select()
        .from(core.participations)
        .where(
          and(
            eq(core.participations.projectId, project.id),
            eq(core.participations.investorId, investor.id)
          )
        )
        .limit(1);

      let participation = existing[0];
      if (!participation) {
        const [created] = await db
          .insert(core.participations)
          .values({
            projectId: project.id,
            investorId: investor.id,
            committedAmount: String(amount),
            paidAmount: "0",
            status: "committed",
          })
          .returning();
        participation = created;
      } else {
        const [updated] = await db
          .update(core.participations)
          .set({
            committedAmount: sql`${core.participations.committedAmount} + ${amount}`,
            status: "committed",
            updatedAt: new Date(),
          })
          .where(eq(core.participations.id, participation.id))
          .returning();
        participation = updated;
      }

      const [transaction] = await db
        .insert(core.capitalTransactions)
        .values({
          projectId: project.id,
          participationId: participation.id,
          profileId: investor.id,
          kind: "contribution",
          amount: String(amount),
          status: "pending",
          method: "manual",
          notes: body.notes ? String(body.notes) : "Aporte",
        })
        .returning();

      await db.insert(core.auditEvents).values({
        actorId: session?.id,
        action: "capital.contribute",
        entityType: "capital_transaction",
        entityId: transaction.id,
        payload: { amount, investor: investor.email },
      });

      return NextResponse.json({ participation, transaction }, { status: 201 });
    }

    return NextResponse.json({ error: "action desconocida" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
