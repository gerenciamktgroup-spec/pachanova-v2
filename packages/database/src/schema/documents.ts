import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

// Para Data Room de propiedades
export const propertyDocuments = pgTable("property_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull(), // FK to properties.id
  title: varchar("title", { length: 255 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  documentType: varchar("document_type", { length: 50 }).notNull(), // e.g., 'appraisal', 'insurance', 'legal', 'monthly_report'
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Para Firmas Electrónicas vinculantes de usuarios
export const userAgreements = pgTable("user_agreements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(), // FK to users.id
  agreementType: varchar("agreement_type", { length: 100 }).notNull(), // e.g., 'fideicomiso_adhesion_v1'
  documentHash: varchar("document_hash", { length: 255 }), // Hash of the document signed
  ipAddress: varchar("ip_address", { length: 45 }), // Para validez legal
  signedAt: timestamp("signed_at").defaultNow().notNull(),
});
