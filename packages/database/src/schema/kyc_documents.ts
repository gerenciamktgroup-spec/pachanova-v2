import { pgTable, uuid, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { users } from './users';
import { kycStatusEnum } from './enums';

export const kycDocuments = pgTable("kyc_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => users.id).notNull(), // kept as investorId for simplicity but refs users.id
  documentType: varchar("document_type", { length: 50 }).notNull(), // e.g. DNI_FRONT, PASSPORT
  documentUrl: varchar("document_url", { length: 1024 }).notNull(),
  status: kycStatusEnum("status").notNull().default("pending"),
  rejectionReason: varchar("rejection_reason", { length: 500 }),
  providerResponse: jsonb("provider_response"), // Raw response from sumsub/jumio
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
