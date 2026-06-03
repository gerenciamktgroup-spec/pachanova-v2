import { pgTable, uuid, numeric, timestamp, varchar } from "drizzle-orm/pg-core";
import { investors } from "./investors";
import { properties } from "./properties";

export const loans = pgTable("loans", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => investors.id).notNull(),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  collateralAmount: numeric("collateral_amount", { precision: 18, scale: 2 }).notNull(),
  collateralValueUsd: numeric("collateral_value_usd", { precision: 18, scale: 2 }).notNull(),
  borrowedAmount: numeric("borrowed_amount", { precision: 18, scale: 2 }).notNull(),
  interestRate: numeric("interest_rate", { precision: 5, scale: 4 }).notNull().default("0.0800"), // Default 8.00% APY
  accumulatedInterest: numeric("accumulated_interest", { precision: 18, scale: 2 }).notNull().default("0.00"),
  status: varchar("status", { length: 50 }).notNull().default("active"), // 'active', 'repaid', 'liquidated', 'under_collateralized'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
