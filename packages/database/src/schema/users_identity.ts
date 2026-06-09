import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { kycStatusEnum } from "./enums";
export const usersIdentity = pgTable("users_identity", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(),
  kycStatus: kycStatusEnum("kyc_status").default('pending').notNull(),
  smartWalletAddress: varchar("smart_wallet_address", { length: 42 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
