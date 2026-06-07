import { pgTable, uuid, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { users } from './users';

export const investor_profiles = pgTable("investor_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  xpPoints: integer("xp_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  investmentPreferences: jsonb("investment_preferences"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const admin_profiles = pgTable("admin_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  accessLevel: integer("access_level").notNull().default(1),
  permissions: jsonb("permissions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
