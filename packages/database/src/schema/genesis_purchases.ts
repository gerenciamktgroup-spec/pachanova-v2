import { pgTable, uuid, varchar, timestamp, numeric } from "drizzle-orm/pg-core";
import { investors } from "./investors";

export const genesisPurchases = pgTable("genesis_purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => investors.id).notNull(),
  tokenAmount: numeric("token_amount", { precision: 18, scale: 2 }).notNull(),
  usdPricePerToken: numeric("usd_price_per_token", { precision: 18, scale: 2 }).notNull().default("8.40"), // Presale price
  totalUsdAmount: numeric("total_usd_amount", { precision: 18, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending', 'completed', 'failed'
  paymentReference: varchar("payment_reference", { length: 255 }), // MercadoPago reference
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
