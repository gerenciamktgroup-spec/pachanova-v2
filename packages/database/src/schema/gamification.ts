import { pgTable, uuid, varchar, numeric, timestamp } from "drizzle-orm/pg-core";
import { users } from './users';

export const gamification = pgTable("gamification", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => users.id).notNull(),
  referralCode: varchar("referral_code", { length: 50 }).notNull().unique(),
  referredById: uuid("referred_by_id").references(() => users.id),
  totalReferrals: numeric("total_referrals", { precision: 10, scale: 0 }).notNull().default("0"),
  yieldBoostPct: numeric("yield_boost_pct", { precision: 5, scale: 4 }).notNull().default("0.0000"), // e.g., 0.0050 = +0.5% yield boost
  votingBoostPct: numeric("voting_boost_pct", { precision: 5, scale: 4 }).notNull().default("0.0000"), // e.g., 0.05 = +5% voting power boost
  points: numeric("points", { precision: 18, scale: 0 }).notNull().default("0"),
  currentTier: varchar("current_tier", { length: 50 }).notNull().default("BRONZE"), // BRONZE, SILVER, GOLD, PLATINUM
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
