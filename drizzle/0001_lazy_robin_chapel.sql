ALTER TABLE "item" ALTER COLUMN "trimmed_name" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "trimmed_name" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trimmed_name_idx" ON "item" USING btree ("trimmed_name");