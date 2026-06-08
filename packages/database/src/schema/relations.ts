import { relations } from "drizzle-orm";
import { treasury_vaults, escrow_vaults, burn_vaults } from "./vaults";
import { properties } from "./properties";
import { p2pOrders, p2pTrades } from "./p2p";
import { users } from "./users";
import { proposals } from "./governance";

export const treasuryVaultsRelations = relations(treasury_vaults, ({ one }) => ({
  property: one(properties, {
    fields: [treasury_vaults.propertyId],
    references: [properties.id],
  }),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  treasuryVault: one(treasury_vaults, {
    fields: [properties.id],
    references: [treasury_vaults.propertyId],
  }),
  p2pOrders: many(p2pOrders),
}));

export const p2pOrdersRelations = relations(p2pOrders, ({ one, many }) => ({
  property: one(properties, {
    fields: [p2pOrders.propertyId],
    references: [properties.id],
  }),
  sellerInvestor: one(users, {
    fields: [p2pOrders.sellerInvestorId],
    references: [users.id],
  }),
  trades: many(p2pTrades),
}));

export const p2pTradesRelations = relations(p2pTrades, ({ one }) => ({
  order: one(p2pOrders, {
    fields: [p2pTrades.orderId],
    references: [p2pOrders.id],
  }),
  property: one(properties, {
    fields: [p2pTrades.propertyId],
    references: [properties.id],
  }),
  buyerInvestor: one(users, {
    fields: [p2pTrades.buyerInvestorId],
    references: [users.id],
  }),
  sellerInvestor: one(users, {
    fields: [p2pTrades.sellerInvestorId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  p2pOrders: many(p2pOrders),
  p2pTradesBought: many(p2pTrades, { relationName: "buyer" }),
  p2pTradesSold: many(p2pTrades, { relationName: "seller" }),
}));

export const proposalsRelations = relations(proposals, ({ one }) => ({
  relatedProperty: one(properties, {
    fields: [proposals.relatedPropertyId],
    references: [properties.id],
  }),
}));
