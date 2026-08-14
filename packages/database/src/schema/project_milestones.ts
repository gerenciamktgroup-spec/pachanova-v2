import { pgTable, uuid, varchar, text, numeric, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { properties } from "./properties";

export const projectMilestones = pgTable("project_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(1),
  budgetAllocatedUsd: numeric("budget_allocated_usd", { precision: 18, scale: 2 }),
  disbursementApproved: boolean("disbursement_approved").notNull().default(false),
  fideicomisoApproved: boolean("fideicomiso_approved").notNull().default(false),
  status: varchar("status", { length: 30 }).notNull().default("pending"), // pending | in_progress | completed | verified
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
