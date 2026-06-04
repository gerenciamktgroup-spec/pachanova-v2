import { pgTable, uuid, numeric, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { investors } from "./investors.ts";
import { properties } from "./properties.ts";

export const balances = pgTable("balances", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => investors.id).notNull(),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  availableUsd: numeric("available_usd", { precision: 18, scale: 2 }).notNull().default("0"),
  lockedUsd: numeric("locked_usd", { precision: 18, scale: 2 }).notNull().default("0"),
  availableTokens: numeric("available_tokens", { precision: 18, scale: 2 }).notNull().default("0"),
  lockedTokens: numeric("locked_tokens", { precision: 18, scale: 2 }).notNull().default("0"),
  reservedTokens: numeric("reserved_tokens", { precision: 18, scale: 2 }).notNull().default("0"),
  onchainProof: varchar("onchain_proof", { length: 255 }),
  lastOnchainSync: timestamp("last_onchain_sync"),
  onchainVerifiedPct: numeric("onchain_verified_pct", { precision: 5, scale: 2 }),
  lastUpdatedAt: timestamp("last_updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    investorPropertyIdx: uniqueIndex("investor_property_idx").on(table.investorId, table.propertyId),
  };
});
