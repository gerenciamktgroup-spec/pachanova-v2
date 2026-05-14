import { pgTable, uuid, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { investors } from "./investors";

export const kycDocuments = pgTable("kyc_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => investors.id).notNull(),
  documentType: varchar("document_type", { length: 50 }).notNull(), // IDENTITY_FRONT, IDENTITY_BACK, PROOF_OF_ADDRESS
  fileUrl: varchar("file_url", { length: 500 }).notNull(), // Supabase storage URL
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, verified, rejected
  rejectionReason: varchar("rejection_reason", { length: 255 }),
  isDemo: boolean("is_demo").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
