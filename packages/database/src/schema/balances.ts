import { pgTable, uuid, numeric, timestamp } from "drizzle-orm/pg-core";
import { investors } from "./investors";

export const balances = pgTable("balances", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => investors.id).notNull().unique(),
  availableUsd: numeric("available_usd", { precision: 18, scale: 2 }).notNull().default("0"),
  lockedUsd: numeric("locked_usd", { precision: 18, scale: 2 }).notNull().default("0"),
  availableTokens: numeric("available_tokens", { precision: 18, scale: 2 }).notNull().default("0"),
  lockedTokens: numeric("locked_tokens", { precision: 18, scale: 2 }).notNull().default("0"),
  reservedTokens: numeric("reserved_tokens", { precision: 18, scale: 2 }).notNull().default("0"),
  lastUpdatedAt: timestamp("last_updated_at").defaultNow().notNull(),
});
