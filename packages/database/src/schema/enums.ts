import { pgEnum } from "drizzle-orm/pg-core";

export const kycStatusEnum = pgEnum("kyc_status_enum", ["pending", "approved", "rejected"]);
export const userRoleEnum = pgEnum("user_role_enum", ["investor", "operator", "admin", "fiduciario", "comite"]);
export const transactionTypeEnum = pgEnum("transaction_type_enum", ["transfer", "mint", "burn", "deposit", "withdrawal", "fee", "dividend"]);
export const transactionStatusEnum = pgEnum("transaction_status_enum", ["pending", "processing", "completed", "failed", "cancelled"]);
export const propertyStatusEnum = pgEnum("property_status_enum", ["coming_soon", "funding", "funded", "trading", "liquidated"]);
export const p2pStatusEnum = pgEnum("p2p_status_enum", ["open", "partial", "filled", "cancelled", "expired", "pending_approval"]);
export const notificationTypeEnum = pgEnum("notification_type_enum", ["system", "transaction", "kyc", "market", "dividend"]);
export const propertyTypeEnum = pgEnum("property_type_enum", ["land", "residential", "hotel", "rental"]);
export const proposalStatusEnum = pgEnum("proposal_status_enum", ["draft", "active", "passed", "rejected", "executed", "cancelled"]);
export const voteChoiceEnum = pgEnum("vote_choice_enum", ["for", "against", "abstain"]);
export const trustAuditStatusEnum = pgEnum("trust_audit_status_enum", ["pending", "audited", "flagged"]);

export const assetStatusEnum = pgEnum("asset_status", ["active", "in_liquidation", "liquidated"]);
export const kycStatusEnum2 = pgEnum("kyc_status", ["pending", "approved", "rejected"]);
