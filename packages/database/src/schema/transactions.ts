import { pgTable, uuid, varchar, numeric, timestamp } from "drizzle-orm/pg-core";
import { investors } from "./investors";

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").references(() => investors.id), // Null for minting
  receiverId: uuid("receiver_id").references(() => investors.id), // Null for burning
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'transfer', 'mint', 'burn', 'deposit', 'withdrawal'
  status: varchar("status", { length: 50 }).notNull().default("completed"),
  txHash: varchar("tx_hash", { length: 66 }), // On-chain ref
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
