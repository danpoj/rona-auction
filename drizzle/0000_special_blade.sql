CREATE TABLE IF NOT EXISTS "item" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"trimmed_name" varchar(100) DEFAULT '',
	"desc" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp,
	"count" integer NOT NULL,
	"price" varchar(100) NOT NULL,
	"additional" varchar(255) DEFAULT '' NOT NULL,
	"item_id" integer,
	"itemName" varchar(100) NOT NULL
);
