ALTER TABLE "custom_field_values" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "custom_fields" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tender_team_members" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "custom_field_values" CASCADE;--> statement-breakpoint
DROP TABLE "custom_fields" CASCADE;--> statement-breakpoint
DROP TABLE "tender_team_members" CASCADE;--> statement-breakpoint
ALTER TABLE "tenders" DROP CONSTRAINT "chk_deadline_after_publication";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'viewer'::text;--> statement-breakpoint
ALTER TABLE "allowed_status_transitions" ALTER COLUMN "required_role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'tender_manager', 'viewer');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'viewer'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "allowed_status_transitions" ALTER COLUMN "required_role" SET DATA TYPE "public"."user_role" USING "required_role"::"public"."user_role";