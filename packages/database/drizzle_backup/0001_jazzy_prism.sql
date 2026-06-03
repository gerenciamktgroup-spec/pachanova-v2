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
	"year" integer NOT NULL,
	"price_per_sqm" numeric(18, 2) NOT NULL,
	"price_per_token" numeric(18, 2) NOT NULL,
	"source" varchar(50) NOT NULL,
	"confirmed_by_fideicomiso" boolean DEFAULT false NOT NULL,
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
	"user_id" uuid NOT NULL,
	"quantity" numeric(18, 2) NOT NULL,
	"unit_price" numeric(18, 2) NOT NULL,
	"total_amount" numeric(18, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"preference_id" varchar(255),
	"mp_payment_id" varchar(255),
	"external_reference" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "p2p_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_investor_id" uuid NOT NULL,
	"quantity" numeric(18, 2) NOT NULL,
	"price_per_token" numeric(18, 2) NOT NULL,
	"total_amount" numeric(18, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'open' NOT NULL,
	"simulated" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "p2p_trades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"buyer_investor_id" uuid NOT NULL,
	"seller_investor_id" uuid NOT NULL,
	"quantity" numeric(18, 2) NOT NULL,
	"price_per_token" numeric(18, 2) NOT NULL,
	"total_amount" numeric(18, 2) NOT NULL,
	"simulated" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "balances" ADD COLUMN "reserved_tokens" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "p2p_orders" ADD CONSTRAINT "p2p_orders_seller_investor_id_investors_id_fk" FOREIGN KEY ("seller_investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_order_id_p2p_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."p2p_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_buyer_investor_id_investors_id_fk" FOREIGN KEY ("buyer_investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_seller_investor_id_investors_id_fk" FOREIGN KEY ("seller_investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investors" DROP COLUMN "usd_balance";--> statement-breakpoint
ALTER TABLE "investors" DROP COLUMN "token_balance";