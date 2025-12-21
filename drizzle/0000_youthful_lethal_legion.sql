CREATE TABLE "todos" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
