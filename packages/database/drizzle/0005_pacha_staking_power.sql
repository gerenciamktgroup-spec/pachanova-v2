-- Fase42: DeFi Staking & Pacha Power Accrual (Bloqueo de PACHA para aumentar poder de voto + descuentos)
-- stakes table stores per-investor staked PACHA amount (upsert on stake/unstake)
-- Voting power queries now: SUM(balances available+locked) + SUM(stakes staked_amount)
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stakes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"staked_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stakes" ADD CONSTRAINT "stakes_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_investor_stake" ON "stakes" ("investor_id");
--> statement-breakpoint
-- Index for quick power lookups
CREATE INDEX IF NOT EXISTS stakes_investor_idx ON "stakes" ("investor_id");
