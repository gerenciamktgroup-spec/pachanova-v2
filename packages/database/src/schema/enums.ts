import { pgEnum } from "drizzle-orm/pg-core";

export const kycStatusEnum = pgEnum("kyc_status_enum", ["pending", "approved", "rejected"]);
export const userRoleEnum = pgEnum("user_role_enum", ["investor", "operator", "admin"]);
export const transactionTypeEnum = pgEnum("transaction_type_enum", ["transfer", "mint", "burn", "deposit", "withdrawal", "fee", "dividend"]);
export const transactionStatusEnum = pgEnum("transaction_status_enum", ["pending", "processing", "completed", "failed", "cancelled"]);
export const propertyStatusEnum = pgEnum("property_status_enum", ["coming_soon", "funding", "funded", "trading", "liquidated"]);
export const p2pStatusEnum = pgEnum("p2p_status_enum", ["open", "partial", "filled", "cancelled", "expired"]);
export const notificationTypeEnum = pgEnum("notification_type_enum", ["system", "transaction", "kyc", "market", "dividend"]);
