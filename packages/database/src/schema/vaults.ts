import { pgTable, uuid, varchar, numeric, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { properties } from './properties';

export const treasury_vaults = pgTable("treasury_vaults", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").references(() => properties.id).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  availableTokens: numeric("available_tokens", { precision: 18, scale: 2 }).notNull().default("0"),
  lockedTokens: numeric("locked_tokens", { precision: 18, scale: 2 }).notNull().default("0"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const escrow_vaults = pgTable("escrow_vaults", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  name: varchar("name", { length: 255 }).notNull().default("P2P Escrow"),
  escrowedTokens: numeric("escrowed_tokens", { precision: 18, scale: 2 }).notNull().default("0"),
  escrowedUsd: numeric("escrowed_usd", { precision: 18, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const burn_vaults = pgTable("burn_vaults", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").references(() => properties.id).notNull().unique(),
  burnedTokens: numeric("burned_tokens", { precision: 18, scale: 2 }).notNull().default("0"),
  liquidationUsd: numeric("liquidation_usd", { precision: 18, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
