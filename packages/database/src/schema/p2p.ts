import { pgTable, uuid, varchar, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { investors } from "./investors";
import { properties } from "./properties";
import { p2pStatusEnum } from "./enums";

export const p2pOrders = pgTable("p2p_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerInvestorId: uuid("seller_investor_id").references(() => investors.id).notNull(),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  quantity: numeric("quantity", { precision: 18, scale: 2 }).notNull(),
  pricePerToken: numeric("price_per_token", { precision: 18, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 18, scale: 2 }).notNull(),
  status: p2pStatusEnum("status").notNull().default("open"),
  expiresAt: timestamp("expires_at"),
  isDemo: boolean("is_demo").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const p2pTrades = pgTable("p2p_trades", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => p2pOrders.id).notNull(),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  buyerInvestorId: uuid("buyer_investor_id").references(() => investors.id).notNull(),
  sellerInvestorId: uuid("seller_investor_id").references(() => investors.id).notNull(),
  quantity: numeric("quantity", { precision: 18, scale: 2 }).notNull(),
  pricePerToken: numeric("price_per_token", { precision: 18, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 18, scale: 2 }).notNull(),
  feeAmount: numeric("fee_amount", { precision: 18, scale: 2 }).default("0"),
  isDemo: boolean("is_demo").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
