import { pgTable, uuid, varchar, numeric, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { investors } from "./investors";
import { properties } from "./properties";

export const tokenOrders = pgTable("token_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => investors.id).notNull(),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  quantity: numeric("quantity", { precision: 18, scale: 2 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 18, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 18, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  preferenceId: varchar("preference_id", { length: 255 }),
  mpPaymentId: varchar("mp_payment_id", { length: 255 }),
  externalReference: varchar("external_reference", { length: 255 }),
  isDemo: boolean("is_demo").notNull().default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const fideicomisoOperations = pgTable("fideicomiso_operations", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 50 }).notNull(), 
  sunarpHash: varchar("sunarp_hash", { length: 255 }),
  notarioHash: varchar("notario_hash", { length: 255 }),
  tokenAmount: numeric("token_amount", { precision: 18, scale: 2 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  requiredSignatures: integer("required_signatures").notNull().default(2),
  currentSignatures: integer("current_signatures").notNull().default(0),
  createdBy: uuid("created_by").notNull(),
  executedAt: timestamp("executed_at"),
  simulated: boolean("simulated").notNull().default(false),
});

export const fideicomisoSignatures = pgTable("fideicomiso_signatures", {
  id: uuid("id").primaryKey().defaultRandom(),
  operationId: uuid("operation_id").notNull(),
  signerId: uuid("signer_id").notNull(),
  signerRole: varchar("signer_role", { length: 50 }).notNull(),
  signatureHash: varchar("signature_hash", { length: 255 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const annualValuations = pgTable("annual_valuations", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  year: integer("year").notNull(),
  totalValuationUsd: numeric("total_valuation_usd", { precision: 18, scale: 2 }).notNull(),
  pricePerSqm: numeric("price_per_sqm", { precision: 18, scale: 2 }).notNull(),
  pricePerToken: numeric("price_per_token", { precision: 18, scale: 2 }).notNull(),
  source: varchar("source", { length: 50 }).notNull(),
  confirmedByFideicomiso: boolean("confirmed_by_fideicomiso").notNull().default(false),
  isDemo: boolean("is_demo").notNull().default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
