import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const kycDocuments = pgTable("kyc_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").notNull(),
  documentType: varchar("document_type", { length: 50 }).notNull(),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  rejectionReason: varchar("rejection_reason", { length: 255 }),
  isDemo: boolean("is_demo").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
