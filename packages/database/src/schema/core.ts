import {
  pgTable,
  pgEnum,
  uuid,
  text,
  numeric,
  timestamp,
  integer,
  date,
  jsonb,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", [
  "admin",
  "investor",
  "client",
  "operator",
  "fiduciario",
  "comite",
]);
export const kycStatus = pgEnum("kyc_status", [
  "pending",
  "in_review",
  "approved",
  "rejected",
]);
export const projectType = pgEnum("project_type", [
  "landbanking",
  "building_sale",
  "building_rent",
  "other",
]);
export const projectStatus = pgEnum("project_status", [
  "draft",
  "funding",
  "active",
  "exiting",
  "closed",
  "archived",
]);
export const roundStatus = pgEnum("round_status", [
  "planned",
  "open",
  "paused",
  "closed",
]);
export const participationStatus = pgEnum("participation_status", [
  "committed",
  "partially_paid",
  "active",
  "exited",
  "cancelled",
]);
export const capitalKind = pgEnum("capital_kind", [
  "contribution",
  "refund",
  "distribution",
  "adjustment",
]);
export const moneyStatus = pgEnum("money_status", [
  "pending",
  "reconciled",
  "failed",
  "cancelled",
]);
export const listingKind = pgEnum("listing_kind", [
  "lot",
  "unit_sale",
  "rental",
]);
export const listingStatus = pgEnum("listing_status", [
  "draft",
  "published",
  "reserved",
  "sold",
  "rented",
  "withdrawn",
]);
export const orderStatus = pgEnum("order_status", [
  "reserved",
  "contracted",
  "paying",
  "delivered",
  "cancelled",
]);
export const milestoneStatus = pgEnum("milestone_status", [
  "pending",
  "in_progress",
  "done",
  "skipped",
]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  authUserId: uuid("auth_user_id"),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull().default(""),
  phone: text("phone"),
  role: userRole("role").notNull().default("investor"),
  secondaryRole: userRole("secondary_role"),
  kycStatus: kycStatus("kyc_status").notNull().default("pending"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const kycFiles = pgTable("kyc_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  docType: text("doc_type").notNull(),
  fileUrl: text("file_url").notNull(),
  status: kycStatus("status").notNull().default("pending"),
  notes: text("notes"),
  reviewedBy: uuid("reviewed_by").references(() => profiles.id),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  type: projectType("type").notNull(),
  status: projectStatus("status").notNull().default("draft"),
  location: text("location").notNull().default(""),
  country: text("country").notNull().default("PE"),
  thesis: text("thesis"),
  currency: text("currency").notNull().default("USD"),
  targetCapital: numeric("target_capital", { precision: 18, scale: 2 }).notNull().default("0"),
  raisedCapital: numeric("raised_capital", { precision: 18, scale: 2 }).notNull().default("0"),
  roundStatus: roundStatus("round_status").notNull().default("planned"),
  coverImageUrl: text("cover_image_url"),
  metadata: jsonb("metadata").notNull().default({}),
  createdBy: uuid("created_by").references(() => profiles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectDocuments = pgTable("project_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").notNull().default("general"),
  fileUrl: text("file_url").notNull(),
  version: integer("version").notNull().default(1),
  contentHash: text("content_hash"),
  visibility: text("visibility").notNull().default("admin"),
  uploadedBy: uuid("uploaded_by").references(() => profiles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectMilestones = pgTable("project_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: milestoneStatus("status").notNull().default("pending"),
  evidenceUrl: text("evidence_url"),
  dueDate: date("due_date"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const participations = pgTable("participations", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "restrict" }),
  investorId: uuid("investor_id").notNull().references(() => profiles.id, { onDelete: "restrict" }),
  committedAmount: numeric("committed_amount", { precision: 18, scale: 2 }).notNull().default("0"),
  paidAmount: numeric("paid_amount", { precision: 18, scale: 2 }).notNull().default("0"),
  ownershipPct: numeric("ownership_pct", { precision: 9, scale: 6 }).notNull().default("0"),
  status: participationStatus("status").notNull().default("committed"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const capitalTransactions = pgTable("capital_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "restrict" }),
  participationId: uuid("participation_id").references(() => participations.id, { onDelete: "set null" }),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "restrict" }),
  kind: capitalKind("kind").notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: moneyStatus("status").notNull().default("pending"),
  method: text("method").notNull().default("manual"),
  externalId: text("external_id"),
  notes: text("notes"),
  reconciledBy: uuid("reconciled_by").references(() => profiles.id),
  reconciledAt: timestamp("reconciled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "restrict" }),
  kind: listingKind("kind").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  unitCode: text("unit_code"),
  areaM2: numeric("area_m2", { precision: 12, scale: 2 }),
  price: numeric("price", { precision: 18, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  status: listingStatus("status").notNull().default("draft"),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clientOrders = pgTable("client_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id").notNull().references(() => listings.id, { onDelete: "restrict" }),
  clientId: uuid("client_id").notNull().references(() => profiles.id, { onDelete: "restrict" }),
  status: orderStatus("status").notNull().default("reserved"),
  reservedAt: timestamp("reserved_at", { withTimezone: true }).notNull().defaultNow(),
  contractedAt: timestamp("contracted_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  contractUrl: text("contract_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clientPayments = pgTable("client_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => clientOrders.id, { onDelete: "restrict" }),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  kind: text("kind").notNull().default("installment"),
  status: moneyStatus("status").notNull().default("pending"),
  method: text("method").notNull().default("manual"),
  externalId: text("external_id"),
  dueDate: date("due_date"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => profiles.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id"),
  reason: text("reason"),
  payload: jsonb("payload").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
