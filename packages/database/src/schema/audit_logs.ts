import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { users } from './users';

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  action: varchar("action", { length: 255 }).notNull(),
  details: text("details").notNull(),
  userId: uuid("user_id").references(() => users.id), // Can be null for system actions
  ipAddress: varchar("ip_address", { length: 45 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(), // Exact compliance: timestamp instead of created_at
});
