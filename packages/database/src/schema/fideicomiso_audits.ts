import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { properties } from './properties';
import { users } from './users';

export const fideicomisoAudits = pgTable("fideicomiso_audits", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  documentType: varchar("document_type", { length: 100 }).notNull(), // e.g., 'CONTRATO_MARCO', 'RESOLUCION_ASAMBLEA', 'REPORTE_YIELD'
  ipfsHash: varchar("ipfs_hash", { length: 255 }).notNull(),
  arweaveTxId: varchar("arweave_tx_id", { length: 255 }),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by").references(() => users.id),
});
