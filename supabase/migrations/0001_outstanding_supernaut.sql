DO $$ BEGIN
 CREATE TYPE "client_type" AS ENUM('individual', 'company', 'government', 'ngo', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "extension_status" AS ENUM('requested', 'approved', 'rejected', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "reminder_type" AS ENUM('email', 'sms', 'push_notification');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "tender_status" AS ENUM('draft', 'open', 'closed', 'under_evaluation', 'awarded', 'cancelled', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('admin', 'project_manager', 'team_member', 'client_user', 'guest');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tenders" DROP CONSTRAINT "tenders_category_id_tender_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_category_id_tender_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."tender_categories"("id") ON DELETE set null ON UPDATE no action;