ALTER TYPE "public"."p2p_status_enum" ADD VALUE 'pending_approval';--> statement-breakpoint
ALTER TABLE "p2p_trades" ADD COLUMN "status" "p2p_status_enum" DEFAULT 'pending_approval' NOT NULL;