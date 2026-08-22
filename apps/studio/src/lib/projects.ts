import { db, core } from "./db";
import { eq, inArray } from "drizzle-orm";

export async function projectByCode(code: string) {
  const [row] = await db.select().from(core.projects).where(eq(core.projects.code, code.toUpperCase())).limit(1);
  return row ?? null;
}

export async function projectBundle(code: string) {
  const project = await projectByCode(code);
  if (!project) return null;
  const [documents, milestones, listings, capital, participations, orderRows] = await Promise.all([
    db.select().from(core.projectDocuments).where(eq(core.projectDocuments.projectId, project.id)),
    db.select().from(core.projectMilestones).where(eq(core.projectMilestones.projectId, project.id)),
    db.select().from(core.listings).where(eq(core.listings.projectId, project.id)),
    db.select().from(core.capitalTransactions).where(eq(core.capitalTransactions.projectId, project.id)),
    db
      .select({
        participation: core.participations,
        investor: { id: core.profiles.id, email: core.profiles.email, fullName: core.profiles.fullName },
      })
      .from(core.participations)
      .innerJoin(core.profiles, eq(core.participations.investorId, core.profiles.id))
      .where(eq(core.participations.projectId, project.id)),
    db
      .select({ order: core.clientOrders, listing: core.listings })
      .from(core.clientOrders)
      .innerJoin(core.listings, eq(core.clientOrders.listingId, core.listings.id))
      .where(eq(core.listings.projectId, project.id)),
  ]);
  const ids = orderRows.map((r) => r.order.id);
  const payments = ids.length
    ? await db.select().from(core.clientPayments).where(inArray(core.clientPayments.orderId, ids))
    : [];
  return { project, documents, milestones, listings, capital, participations, orders: orderRows, payments };
}
