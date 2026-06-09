import { pgTable, uuid, varchar, numeric, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  propertyType: varchar("property_type", { length: 50 }).notNull(),
  imageUrl: varchar("image_url", { length: 1024 }),
  status: varchar("status", { length: 50 }).notNull(),
  totalValuationUsd: numeric("total_valuation_usd", { precision: 18, scale: 2 }).notNull(),
  tokenPriceUsd: numeric("token_price_usd", { precision: 18, scale: 2 }).notNull(),
  totalTokens: numeric("total_tokens", { precision: 18, scale: 2 }).notNull(),
  availableTokens: numeric("available_tokens", { precision: 18, scale: 2 }).notNull(),
  annualYieldExpected: numeric("annual_yield_expected", { precision: 5, scale: 2 }),
  contractAddress: varchar("contract_address", { length: 66 }),
  isDemo: boolean("is_demo").default(false).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
