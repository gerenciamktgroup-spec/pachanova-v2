import { pgTable, uuid, varchar, numeric, integer, boolean, timestamp, text } from "drizzle-orm/pg-core";

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

export const fideicomisoAudits = pgTable("fideicomiso_audits", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull(), // Map to property_id column on DB
  documentType: varchar("document_type", { length: 100 }).notNull(),
  ipfsHash: varchar("ipfs_hash", { length: 255 }).notNull(),
  arweaveTxId: varchar("arweave_tx_id", { length: 255 }),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
});
