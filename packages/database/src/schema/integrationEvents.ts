import { pgTable, uuid, varchar, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";

export const integrationEvents = pgTable("integration_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider: varchar("provider", { length: 50 }).notNull(), // 'MERCADOPAGO', 'CONTRACTS', 'ORACLE', etc.
  eventType: varchar("event_type", { length: 100 }).notNull(),
  payload: jsonb("payload"),
  status: varchar("status", { length: 50 }).notNull().default("received"),
  txHash: varchar("tx_hash", { length: 255 }),
  simulated: boolean("simulated").notNull().default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
