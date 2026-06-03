-- Fase33: Gobernanza Colectiva RWA - proposals and votes tables
--> statement-breakpoint
CREATE TYPE "public"."proposal_status_enum" AS ENUM('draft', 'active', 'passed', 'rejected', 'executed', 'cancelled');
--> statement-breakpoint
CREATE TYPE "public"."vote_choice_enum" AS ENUM('for', 'against', 'abstain');
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
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_creator_investor_id_investors_id_fk" FOREIGN KEY ("creator_investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_related_property_id_properties_id_fk" FOREIGN KEY ("related_property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_proposal_id_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_investor_proposal_vote" ON "votes" ("proposal_id","investor_id");
