CREATE TABLE "fideicomiso_audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"document_type" varchar(100) NOT NULL,
	"ipfs_hash" varchar(255) NOT NULL,
	"arweave_tx_id" varchar(255),
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "gamification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"referral_code" varchar(50) NOT NULL,
	"referred_by_id" uuid,
	"total_referrals" numeric(10, 0) DEFAULT '0' NOT NULL,
	"yield_boost_pct" numeric(5, 4) DEFAULT '0.0000' NOT NULL,
	"voting_boost_pct" numeric(5, 4) DEFAULT '0.0000' NOT NULL,
	"points" numeric(18, 0) DEFAULT '0' NOT NULL,
	"current_tier" varchar(50) DEFAULT 'BRONZE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gamification_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
ALTER TABLE "balances" ADD COLUMN "onchain_proof" varchar(255);--> statement-breakpoint
ALTER TABLE "balances" ADD COLUMN "last_onchain_sync" timestamp;--> statement-breakpoint
ALTER TABLE "balances" ADD COLUMN "onchain_verified_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "distributions" ADD COLUMN "onchain_proof" varchar(255);--> statement-breakpoint
ALTER TABLE "distributions" ADD COLUMN "last_onchain_sync" timestamp;--> statement-breakpoint
ALTER TABLE "fideicomiso_audits" ADD CONSTRAINT "fideicomiso_audits_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fideicomiso_audits" ADD CONSTRAINT "fideicomiso_audits_created_by_investors_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gamification" ADD CONSTRAINT "gamification_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gamification" ADD CONSTRAINT "gamification_referred_by_id_investors_id_fk" FOREIGN KEY ("referred_by_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;