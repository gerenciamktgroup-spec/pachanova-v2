import { pgTable, uuid, varchar, timestamp, numeric } from "drizzle-orm/pg-core";
import { investors } from "./investors";

export const tokenLedger = pgTable("token_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => investors.id),
  operation: varchar("operation", { length: 50 }).notNull(), // 'mint', 'transfer', 'burn'
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  txHash: varchar("tx_hash", { length: 66 }).unique(), // Blockchain tx hash if applicable
  previousHash: varchar("previous_hash", { length: 66 }).notNull(), // Hash-chained for immutability
  currentHash: varchar("current_hash", { length: 66 }).notNull().unique(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
