import { pgTable, uuid, numeric, varchar, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { transactionTypeEnum, transactionStatusEnum } from "./enums";

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id"),
  receiverId: uuid("receiver_id"),
  propertyId: uuid("property_id"),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  feeAmount: numeric("fee_amount", { precision: 18, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  paymentProvider: varchar("payment_provider", { length: 50 }),
  paymentReference: varchar("payment_reference", { length: 255 }),
  type: transactionTypeEnum("type").notNull(),
  status: transactionStatusEnum("status").notNull().default("completed"),
  txHash: varchar("tx_hash", { length: 66 }),
  isDemo: boolean("is_demo").notNull().default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
