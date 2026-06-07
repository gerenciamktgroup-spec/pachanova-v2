import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from './users';
import { notificationTypeEnum } from './enums';

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => users.id).notNull(),
  type: notificationTypeEnum("type").notNull().default("system"),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  actionUrl: varchar("action_url", { length: 500 }),
  isDemo: boolean("is_demo").notNull().default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
