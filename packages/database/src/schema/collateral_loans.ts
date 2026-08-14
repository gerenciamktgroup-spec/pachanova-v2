import { pgTable, uuid, numeric, timestamp, boolean, varchar, integer } from "drizzle-orm/pg-core";
import { investors } from "./investors";
import { properties } from "./properties";

export const collateralLoans = pgTable("collateral_loans", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => investors.id).notNull(),
  propertyId: uuid("property_id").references(() => properties.id),
  collateralPachaAmount: numeric("collateral_pacha_amount", { precision: 18, scale: 2 }).notNull(),
  principalBorrowedUsd: numeric("principal_borrowed_usd", { precision: 18, scale: 2 }).notNull(),
  interestRateBps: integer("interest_rate_bps").notNull().default(800), // 8.00% APY
  accruedInterestUsd: numeric("accrued_interest_usd", { precision: 18, scale: 2 }).notNull().default("0"),
  ltvPercent: numeric("ltv_percent", { precision: 5, scale: 2 }).notNull().default("60.00"),
  status: varchar("status", { length: 30 }).notNull().default("active"), // active | repaid | liquidated
  isDemo: boolean("is_demo").notNull().default(false),
  dueAt: timestamp("due_at"),
  repaidAt: timestamp("repaid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
