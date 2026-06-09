import { pgTable, uuid, varchar, numeric, timestamp } from "drizzle-orm/pg-core";
import { trusts } from "./trusts";
import { assetStatusEnum } from "./enums";
export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  trustId: uuid("trust_id").references(() => trusts.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  valorFiatInicial: numeric("valor_fiat_inicial", { precision: 12, scale: 2 }).notNull(),
  valorFiatActual: numeric("valor_fiat_actual", { precision: 12, scale: 2 }).notNull(),
  estado: assetStatusEnum("estado").default('active').notNull(),
  successFeePercentage: numeric("success_fee_percentage", { precision: 5, scale: 2 }).default('15.00').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
