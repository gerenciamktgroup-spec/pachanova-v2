import { pgTable, uuid, varchar, numeric, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { investors } from "./investors";
import { properties } from "./properties";
import { transactionTypeEnum, transactionStatusEnum } from "./enums";

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").references(() => investors.id), // Null for minting
  receiverId: uuid("receiver_id").references(() => investors.id), // Null for burning
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
