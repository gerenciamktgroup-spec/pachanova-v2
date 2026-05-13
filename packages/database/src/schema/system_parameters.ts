import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const systemParameters = pgTable("system_parameters", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
