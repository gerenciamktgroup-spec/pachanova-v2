import { pgTable, uuid, varchar, text, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";

export const webhookQueue = pgTable("webhook_queue", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider: varchar("provider", { length: 50 }).notNull(),       // MERCADOPAGO | SUMSUB
  eventType: varchar("event_type", { length: 100 }).notNull(),
  payload: jsonb("payload").notNull(),
  rawBody: text("raw_body"),
  headers: jsonb("headers"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending | processing | done | failed
  attempts: integer("attempts").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(3),
  lastError: text("last_error"),
  processedAt: timestamp("processed_at"),
  nextRetryAt: timestamp("next_retry_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isDemo: boolean("is_demo").notNull().default(false),
});
