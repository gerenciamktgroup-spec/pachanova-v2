import { pgTable, uuid, varchar, numeric, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from './users';
import { properties } from './properties';
import { transactionTypeEnum, transactionStatusEnum } from './enums';

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").references(() => users.id), // Null for vault minting
  receiverId: uuid("receiver_id").references(() => users.id), // Null for vault burning
  vaultId: uuid("vault_id"), // Refers to a Vault if interacting directly with Treasury/Escrow/Burn
  propertyId: uuid("property_id").references(() => properties.id), // Context for the tx
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  feeAmount: numeric("fee_amount", { precision: 18, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  paymentProvider: varchar("payment_provider", { length: 50 }), // e.g. mercadopago
  paymentReference: varchar("payment_reference", { length: 255 }), // external tx id
  type: transactionTypeEnum("type").notNull(), 
  status: transactionStatusEnum("status").notNull().default("completed"),
  txHash: varchar("tx_hash", { length: 66 }), // On-chain ref
  isDemo: boolean("is_demo").notNull().default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

