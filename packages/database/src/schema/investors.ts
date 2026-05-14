import { pgTable, uuid, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { userRoleEnum, kycStatusEnum } from "./enums";

export const investors = pgTable("investors", {
  id: uuid("id").primaryKey().defaultRandom(),
  supabaseAuthId: uuid("supabase_auth_id"), // FK to auth.users.id
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  country: varchar("country", { length: 100 }),
  documentType: varchar("document_type", { length: 50 }), // e.g. DNI, PASSPORT
  documentNumber: varchar("document_number", { length: 100 }),
  walletAddress: varchar("wallet_address", { length: 66 }),
  role: userRoleEnum("role").notNull().default("investor"),
  kycStatus: kycStatusEnum("kyc_status").notNull().default("pending"),
  isVerified: boolean("is_verified").notNull().default(false),
  isAccredited: boolean("is_accredited").notNull().default(false),
  isDemo: boolean("is_demo").notNull().default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
