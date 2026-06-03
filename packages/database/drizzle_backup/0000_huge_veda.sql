CREATE TABLE "investors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'investor' NOT NULL,
	"kyc_status" varchar(50) DEFAULT 'pending' NOT NULL,
	"usd_balance" numeric(18, 2) DEFAULT '0' NOT NULL,
	"token_balance" numeric(18, 2) DEFAULT '0' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "investors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "balances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"available_usd" numeric(18, 2) DEFAULT '0' NOT NULL,
	"locked_usd" numeric(18, 2) DEFAULT '0' NOT NULL,
	"available_tokens" numeric(18, 2) DEFAULT '0' NOT NULL,
	"locked_tokens" numeric(18, 2) DEFAULT '0' NOT NULL,
	"last_updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "balances_investor_id_unique" UNIQUE("investor_id")
);
--> statement-breakpoint
CREATE TABLE "token_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid,
	"operation" varchar(50) NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"tx_hash" varchar(66),
	"previous_hash" varchar(66) NOT NULL,
	"current_hash" varchar(66) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "token_ledger_tx_hash_unique" UNIQUE("tx_hash"),
	CONSTRAINT "token_ledger_current_hash_unique" UNIQUE("current_hash")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" varchar(255) NOT NULL,
	"details" text NOT NULL,
	"user_id" uuid,
	"ip_address" varchar(45),
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genesis_purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"token_amount" numeric(18, 2) NOT NULL,
	"usd_price_per_token" numeric(18, 2) DEFAULT '8.40' NOT NULL,
	"total_usd_amount" numeric(18, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"payment_reference" varchar(255),
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid,
	"receiver_id" uuid,
	"amount" numeric(18, 2) NOT NULL,
	"type" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'completed' NOT NULL,
	"tx_hash" varchar(66),
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_parameters" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "balances" ADD CONSTRAINT "balances_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token_ledger" ADD CONSTRAINT "token_ledger_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genesis_purchases" ADD CONSTRAINT "genesis_purchases_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sender_id_investors_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_id_investors_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;