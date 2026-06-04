CREATE TYPE "public"."kyc_status_enum" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."notification_type_enum" AS ENUM('system', 'transaction', 'kyc', 'market', 'dividend');--> statement-breakpoint
CREATE TYPE "public"."p2p_status_enum" AS ENUM('open', 'partial', 'filled', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "public"."property_status_enum" AS ENUM('coming_soon', 'funding', 'funded', 'trading', 'liquidated');--> statement-breakpoint
CREATE TYPE "public"."property_type_enum" AS ENUM('land', 'residential', 'hotel', 'rental');--> statement-breakpoint
CREATE TYPE "public"."proposal_status_enum" AS ENUM('draft', 'active', 'passed', 'rejected', 'executed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."transaction_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."transaction_type_enum" AS ENUM('transfer', 'mint', 'burn', 'deposit', 'withdrawal', 'fee', 'dividend');--> statement-breakpoint
CREATE TYPE "public"."user_role_enum" AS ENUM('investor', 'operator', 'admin', 'fiduciario', 'comite');--> statement-breakpoint
CREATE TYPE "public"."vote_choice_enum" AS ENUM('for', 'against', 'abstain');--> statement-breakpoint
CREATE TABLE "investors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supabase_auth_id" uuid,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"country" varchar(100),
	"document_type" varchar(50),
	"document_number" varchar(100),
	"wallet_address" varchar(66),
	"role" "user_role_enum" DEFAULT 'investor' NOT NULL,
	"kyc_status" "kyc_status_enum" DEFAULT 'pending' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_accredited" boolean DEFAULT false NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "investors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"property_type" "property_type_enum" DEFAULT 'land' NOT NULL,
	"image_url" varchar(1024),
	"status" "property_status_enum" DEFAULT 'coming_soon' NOT NULL,
	"total_valuation_usd" numeric(18, 2) NOT NULL,
	"token_price_usd" numeric(18, 2) NOT NULL,
	"total_tokens" numeric(18, 2) NOT NULL,
	"available_tokens" numeric(18, 2) NOT NULL,
	"annual_yield_expected" numeric(5, 2),
	"contract_address" varchar(66),
	"is_demo" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid,
	"receiver_id" uuid,
	"property_id" uuid,
	"amount" numeric(18, 2) NOT NULL,
	"fee_amount" numeric(18, 2) DEFAULT '0',
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"payment_provider" varchar(50),
	"payment_reference" varchar(255),
	"type" "transaction_type_enum" NOT NULL,
	"status" "transaction_status_enum" DEFAULT 'completed' NOT NULL,
	"tx_hash" varchar(66),
	"is_demo" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "balances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"available_usd" numeric(18, 2) DEFAULT '0' NOT NULL,
	"locked_usd" numeric(18, 2) DEFAULT '0' NOT NULL,
	"available_tokens" numeric(18, 2) DEFAULT '0' NOT NULL,
	"locked_tokens" numeric(18, 2) DEFAULT '0' NOT NULL,
	"reserved_tokens" numeric(18, 2) DEFAULT '0' NOT NULL,
	"last_updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "p2p_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_investor_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"quantity" numeric(18, 2) NOT NULL,
	"price_per_token" numeric(18, 2) NOT NULL,
	"total_amount" numeric(18, 2) NOT NULL,
	"status" "p2p_status_enum" DEFAULT 'open' NOT NULL,
	"expires_at" timestamp,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "p2p_trades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"buyer_investor_id" uuid NOT NULL,
	"seller_investor_id" uuid NOT NULL,
	"quantity" numeric(18, 2) NOT NULL,
	"price_per_token" numeric(18, 2) NOT NULL,
	"total_amount" numeric(18, 2) NOT NULL,
	"fee_amount" numeric(18, 2) DEFAULT '0',
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "system_parameters" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "integration_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar(50) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"payload" jsonb,
	"status" varchar(50) DEFAULT 'received' NOT NULL,
	"tx_hash" varchar(255),
	"simulated" boolean DEFAULT false NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "annual_valuations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"total_valuation_usd" numeric(18, 2) NOT NULL,
	"price_per_sqm" numeric(18, 2) NOT NULL,
	"price_per_token" numeric(18, 2) NOT NULL,
	"source" varchar(50) NOT NULL,
	"confirmed_by_fideicomiso" boolean DEFAULT false NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fideicomiso_operations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(50) NOT NULL,
	"sunarp_hash" varchar(255),
	"notario_hash" varchar(255),
	"token_amount" numeric(18, 2),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"required_signatures" integer DEFAULT 2 NOT NULL,
	"current_signatures" integer DEFAULT 0 NOT NULL,
	"created_by" uuid NOT NULL,
	"executed_at" timestamp,
	"simulated" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fideicomiso_signatures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"operation_id" uuid NOT NULL,
	"signer_id" uuid NOT NULL,
	"signer_role" varchar(50) NOT NULL,
	"signature_hash" varchar(255),
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "token_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"quantity" numeric(18, 2) NOT NULL,
	"unit_price" numeric(18, 2) NOT NULL,
	"total_amount" numeric(18, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"preference_id" varchar(255),
	"mp_payment_id" varchar(255),
	"external_reference" varchar(255),
	"is_demo" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kyc_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"document_type" varchar(50) NOT NULL,
	"file_url" varchar(500) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"rejection_reason" varchar(255),
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "distributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"investor_id" uuid NOT NULL,
	"amount_usd" numeric(18, 2) NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"status" varchar(50) DEFAULT 'PAGADO' NOT NULL,
	"proof_ref" varchar(255),
	"claimed_at" timestamp,
	"compound_details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"type" "notification_type_enum" DEFAULT 'system' NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"action_url" varchar(500),
	"is_demo" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demo_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_name" varchar(255),
	"scenario" varchar(50),
	"state" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"collateral_amount" numeric(18, 2) NOT NULL,
	"collateral_value_usd" numeric(18, 2) NOT NULL,
	"borrowed_amount" numeric(18, 2) NOT NULL,
	"interest_rate" numeric(5, 4) DEFAULT '0.0800' NOT NULL,
	"accumulated_interest" numeric(18, 2) DEFAULT '0.00' NOT NULL,
	"ltv_at_borrow" numeric(5, 4),
	"liquidation_threshold" numeric(5, 4) DEFAULT '0.85' NOT NULL,
	"health_factor" numeric(10, 4) DEFAULT '1.5',
	"last_accrued_at" timestamp DEFAULT now(),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"manual_override_note" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "proposal_status_enum" DEFAULT 'active' NOT NULL,
	"creator_investor_id" uuid,
	"related_property_id" uuid,
	"start_at" timestamp DEFAULT now() NOT NULL,
	"end_at" timestamp,
	"quorum_required" numeric(5, 2) DEFAULT '10.00',
	"vertex_prediction" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stakes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"staked_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proposal_id" uuid NOT NULL,
	"investor_id" uuid NOT NULL,
	"choice" "vote_choice_enum" NOT NULL,
	"voting_power" numeric(18, 2) NOT NULL,
	"onchain_tx_proof" text,
	"tx_hash" varchar(80),
	"block_num" numeric(20, 0),
	"recompute_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sender_id_investors_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_id_investors_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balances" ADD CONSTRAINT "balances_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balances" ADD CONSTRAINT "balances_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_orders" ADD CONSTRAINT "p2p_orders_seller_investor_id_investors_id_fk" FOREIGN KEY ("seller_investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_orders" ADD CONSTRAINT "p2p_orders_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_order_id_p2p_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."p2p_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_buyer_investor_id_investors_id_fk" FOREIGN KEY ("buyer_investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_seller_investor_id_investors_id_fk" FOREIGN KEY ("seller_investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token_ledger" ADD CONSTRAINT "token_ledger_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genesis_purchases" ADD CONSTRAINT "genesis_purchases_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "annual_valuations" ADD CONSTRAINT "annual_valuations_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token_orders" ADD CONSTRAINT "token_orders_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token_orders" ADD CONSTRAINT "token_orders_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_documents" ADD CONSTRAINT "kyc_documents_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distributions" ADD CONSTRAINT "distributions_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distributions" ADD CONSTRAINT "distributions_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_creator_investor_id_investors_id_fk" FOREIGN KEY ("creator_investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_related_property_id_properties_id_fk" FOREIGN KEY ("related_property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakes" ADD CONSTRAINT "stakes_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_proposal_id_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "investor_property_idx" ON "balances" USING btree ("investor_id","property_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_investor_stake" ON "stakes" USING btree ("investor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_investor_proposal_vote" ON "votes" USING btree ("proposal_id","investor_id");