CREATE TABLE IF NOT EXISTS "item" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"desc" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"count" integer NOT NULL,
	"price" integer NOT NULL,
	"item_id" integer
);
