import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
export const trusts = pgTable("trusts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  legalDocumentRef: varchar("legal_document_ref", { length: 500 }),
  auditStatus: varchar("audit_status", { length: 50 }).default('pending'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
