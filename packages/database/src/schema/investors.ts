import { pgTable, uuid, varchar, timestamp, numeric, boolean } from "drizzle-orm/pg-core";

export const investors = pgTable("investors", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 50 }).notNull().default("investor"), // e.g., 'investor', 'admin'
  kycStatus: varchar("kyc_status", { length: 50 }).notNull().default("pending"), // 'pending', 'approved', 'rejected'
  isVerified: boolean("is_verified").notNull().default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(), // Explicitly avoiding created_at issue
});
