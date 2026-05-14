import { pgTable, uuid, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";

export const demoSessions = pgTable("demo_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  prospectName: varchar("prospect_name", { length: 255 }),
  scenario: varchar("scenario", { length: 50 }),
  state: jsonb("state").notNull(), // To hold the simulator's current state
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
