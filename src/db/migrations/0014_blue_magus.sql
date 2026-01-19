ALTER TABLE "member" DROP CONSTRAINT "member_organization_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;