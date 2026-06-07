import { pgTable, uuid, numeric, timestamp, varchar } from "drizzle-orm/pg-core";
import { investors } from './investors';
import { properties } from './properties';

export const loans = pgTable("loans", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => investors.id).notNull(),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  collateralAmount: numeric("collateral_amount", { precision: 18, scale: 2 }).notNull(),
  collateralValueUsd: numeric("collateral_value_usd", { precision: 18, scale: 2 }).notNull(),
  borrowedAmount: numeric("borrowed_amount", { precision: 18, scale: 2 }).notNull(),
  interestRate: numeric("interest_rate", { precision: 5, scale: 4 }).notNull().default("0.0800"), // Default 8.00% APY (Aave-like variable)
  accumulatedInterest: numeric("accumulated_interest", { precision: 18, scale: 2 }).notNull().default("0.00"),
  ltvAtBorrow: numeric("ltv_at_borrow", { precision: 5, scale: 4 }), // e.g. 0.60 for 60%
  liquidationThreshold: numeric("liquidation_threshold", { precision: 5, scale: 4 }).notNull().default("0.85"), // 85% LTV triggers liquidation (MakerDAO/Aave style)
  healthFactor: numeric("health_factor", { precision: 10, scale: 4 }).default("1.5"), // >1 safe, <1 liquidatable
  lastAccruedAt: timestamp("last_accrued_at").defaultNow(),
  status: varchar("status", { length: 50 }).notNull().default("active"), // 'active', 'repaid', 'liquidated', 'under_collateralized'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // For Master manual control / audit (ties to PachaNova landbank overrides)
  manualOverrideNote: varchar("manual_override_note", { length: 500 }),
});
