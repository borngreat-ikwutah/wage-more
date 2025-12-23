CREATE TABLE "nonce" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_address" text NOT NULL,
	"nonce" text NOT NULL,
	"message" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "nonce_nonce_unique" UNIQUE("nonce")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "wallet_address" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_wallet_address_unique" UNIQUE("wallet_address");