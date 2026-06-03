import { pgTable, uuid, varchar, text, timestamp, numeric, uniqueIndex } from "drizzle-orm/pg-core";
import { investors } from "./investors";
import { properties } from "./properties";
import { proposalStatusEnum, voteChoiceEnum } from "./enums";

export const proposals = pgTable("proposals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: proposalStatusEnum("status").notNull().default("active"),
  creatorInvestorId: uuid("creator_investor_id").references(() => investors.id),
  relatedPropertyId: uuid("related_property_id").references(() => properties.id),
  startAt: timestamp("start_at").defaultNow().notNull(),
  endAt: timestamp("end_at"),
  quorumRequired: numeric("quorum_required", { precision: 5, scale: 2 }).default("10.00"), // percent
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const votes = pgTable("votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  proposalId: uuid("proposal_id").references(() => proposals.id).notNull(),
  investorId: uuid("investor_id").references(() => investors.id).notNull(),
  choice: voteChoiceEnum("choice").notNull(),
  votingPower: numeric("voting_power", { precision: 18, scale: 2 }).notNull(), // snapshot of PACHA holdings at vote time (weighted)
  // Fase35: onchain gov attest (tie Fase26/27; real tx@block from publicnode + deterministic proof for recompute/VERIFY in UI + verify script)
  onchainTxProof: text("onchain_tx_proof"), // json string {txHash, blockNum, note, ...} or full proof obj
  txHash: varchar("tx_hash", { length: 80 }),
  blockNum: numeric("block_num", { precision: 20, scale: 0 }),
  recomputeNote: text("recompute_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueInvestorProposal: uniqueIndex("unique_investor_proposal_vote").on(table.proposalId, table.investorId),
}));
