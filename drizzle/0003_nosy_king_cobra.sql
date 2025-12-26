CREATE TYPE "public"."market_status" AS ENUM('PENDING_CREATION', 'ACTIVE', 'PENDING_RESOLUTION', 'RESOLVED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."market_type" AS ENUM('BINARY', 'MULTIPLE');--> statement-breakpoint
CREATE TABLE "bet" (
	"id" text PRIMARY KEY NOT NULL,
	"market_temp_id" text NOT NULL,
	"market_chain_id" bigint,
	"user_address" text NOT NULL,
	"option_index" integer NOT NULL,
	"amount" numeric(78, 0) NOT NULL,
	"tx_hash" text NOT NULL,
	"block_number" bigint,
	"claimed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market" (
	"temp_id" text PRIMARY KEY NOT NULL,
	"id" bigint,
	"creator_address" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"market_type" "market_type" NOT NULL,
	"end_time" timestamp NOT NULL,
	"options" jsonb NOT NULL,
	"status" "market_status" DEFAULT 'PENDING_CREATION' NOT NULL,
	"creation_tx_hash" text,
	"winning_option_index" integer,
	"resolved_at" timestamp,
	"total_pool" numeric(78, 0) DEFAULT '0' NOT NULL,
	"volume_24h" numeric(78, 0) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bet" ADD CONSTRAINT "bet_market_temp_id_market_temp_id_fk" FOREIGN KEY ("market_temp_id") REFERENCES "public"."market"("temp_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bet_user_idx" ON "bet" USING btree ("user_address");--> statement-breakpoint
CREATE INDEX "bet_market_idx" ON "bet" USING btree ("market_temp_id");--> statement-breakpoint
CREATE UNIQUE INDEX "market_chain_id_idx" ON "market" USING btree ("id");--> statement-breakpoint
CREATE INDEX "market_status_idx" ON "market" USING btree ("status");--> statement-breakpoint
CREATE INDEX "market_tags_idx" ON "market" USING gin ("tags");--> statement-breakpoint
CREATE INDEX "market_endtime_idx" ON "market" USING btree ("end_time");