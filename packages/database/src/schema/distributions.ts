import { pgTable, uuid, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { investors } from "./investors";
import { properties } from "./properties";

export const distributions = pgTable("distributions", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  investorId: uuid("investor_id").references(() => investors.id).notNull(),
  amountUsd: numeric("amount_usd", { precision: 18, scale: 2 }).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  isDemo: boolean("is_demo").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
