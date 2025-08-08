CREATE TYPE "public"."client_type" AS ENUM('government', 'parastatal', 'private', 'ngo', 'international', 'other');--> statement-breakpoint
CREATE TYPE "public"."document_category" AS ENUM('tender_notice', 'tender_document', 'technical_specifications', 'financial_proposal', 'legal_documents', 'correspondence', 'other');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('deadline', 'status_change', 'task_assignment', 'document_update', 'custom');--> statement-breakpoint
CREATE TYPE "public"."tender_status" AS ENUM('in_progress', 'submitted', 'awarded', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'tender_manager', 'tender_specialist', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."extension_status" AS ENUM('received', 'in_progress', 'completed', 'sent_to_client', 'acknowledged', 'expired');--> statement-breakpoint
CREATE TYPE "public"."extension_type" AS ENUM('evaluation', 'award', 'both');--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tender_id" uuid,
	"user_id" text NOT NULL,
	"action" varchar(100) NOT NULL,
	"details" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tender_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text,
	"name" varchar(100) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_system_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "client_type" NOT NULL,
	"contact_person" varchar(255),
	"contact_email" varchar(255),
	"contact_phone" varchar(50),
	"address" text,
	"website" varchar(255),
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by_id" text,
	"created_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tender_id" uuid NOT NULL,
	"parent_document_id" uuid,
	"category" "document_category" NOT NULL,
	"title" varchar(255) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"storage_url" varchar(255) NOT NULL,
	"checksum_hash" varchar(64),
	"version" integer DEFAULT 1 NOT NULL,
	"is_latest_version" boolean DEFAULT true NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"archive_reason" varchar(255),
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by_id" text,
	"uploaded_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"reminder_days" integer DEFAULT 7 NOT NULL,
	"timezone" varchar(50) DEFAULT 'UTC',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"role" "user_role" DEFAULT 'viewer' NOT NULL,
	"department" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login" timestamp with time zone,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"preferences" jsonb,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "tenders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"reference_number" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"client_id" uuid NOT NULL,
	"category_id" uuid,
	"status" "tender_status" DEFAULT 'in_progress' NOT NULL,
	"closing_date" timestamp with time zone,
	"evaluation_date" date,
	"award_date" date,
	"estimated_value" numeric(15, 2),
	"actual_value" numeric(15, 2),
	"is_successful" boolean,
	"department" varchar(100),
	"notes" text,
	"tags" text[],
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by_id" text,
	"created_by_id" text NOT NULL,
	"updated_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tender_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"assigned_to_id" text,
	"due_date" timestamp with time zone,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"priority" integer DEFAULT 0 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by_id" text,
	"created_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_completed_task_timestamp" CHECK ((is_completed = false) OR (is_completed = true AND completed_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "reminder_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"days_before" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"message_template" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"related_entity_id" uuid,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allowed_status_transitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_status" "tender_status" NOT NULL,
	"to_status" "tender_status" NOT NULL,
	"required_role" "user_role",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "extension_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"extension_id" uuid NOT NULL,
	"previous_status" "extension_status",
	"new_status" "extension_status" NOT NULL,
	"changed_by_id" text NOT NULL,
	"change_reason" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "extension_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"extension_id" uuid NOT NULL,
	"reminder_type" varchar(50) NOT NULL,
	"scheduled_for" timestamp with time zone NOT NULL,
	"sent_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tender_extensions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tender_id" uuid NOT NULL,
	"extension_document_id" uuid,
	"extension_number" varchar(50) NOT NULL,
	"extension_type" "extension_type" NOT NULL,
	"status" "extension_status" DEFAULT 'received' NOT NULL,
	"original_deadline" timestamp with time zone NOT NULL,
	"current_deadline" timestamp with time zone NOT NULL,
	"requested_new_deadline" timestamp with time zone NOT NULL,
	"actual_new_deadline" timestamp with time zone,
	"extension_days" integer NOT NULL,
	"cumulative_days" integer NOT NULL,
	"reason" text NOT NULL,
	"client_reference" varchar(100),
	"urgency_level" varchar(20) DEFAULT 'normal',
	"internal_notes" text,
	"processing_notes" text,
	"client_response" text,
	"received_at" timestamp with time zone NOT NULL,
	"processed_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"acknowledged_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"received_by_id" text NOT NULL,
	"processed_by_id" text,
	"sent_by_id" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_tender_id_tenders_id_fk" FOREIGN KEY ("tender_id") REFERENCES "public"."tenders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_tender_id_tenders_id_fk" FOREIGN KEY ("tender_id") REFERENCES "public"."tenders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_category_id_tender_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."tender_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_tender_id_tenders_id_fk" FOREIGN KEY ("tender_id") REFERENCES "public"."tenders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extension_history" ADD CONSTRAINT "extension_history_extension_id_tender_extensions_id_fk" FOREIGN KEY ("extension_id") REFERENCES "public"."tender_extensions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extension_reminders" ADD CONSTRAINT "extension_reminders_extension_id_tender_extensions_id_fk" FOREIGN KEY ("extension_id") REFERENCES "public"."tender_extensions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tender_extensions" ADD CONSTRAINT "tender_extensions_tender_id_tenders_id_fk" FOREIGN KEY ("tender_id") REFERENCES "public"."tenders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tender_extensions" ADD CONSTRAINT "tender_extensions_extension_document_id_documents_id_fk" FOREIGN KEY ("extension_document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_activity_logs_tender" ON "activity_logs" USING btree ("tender_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_activity_logs_user" ON "activity_logs" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_activity_logs_action" ON "activity_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "idx_categories_organization" ON "tender_categories" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_categories_system" ON "tender_categories" USING btree ("is_system_default");--> statement-breakpoint
CREATE INDEX "idx_categories_name" ON "tender_categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_clients_organization_id" ON "clients" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_clients_name" ON "clients" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_clients_type" ON "clients" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_documents_tender_category" ON "documents" USING btree ("tender_id","category");--> statement-breakpoint
CREATE INDEX "idx_documents_version" ON "documents" USING btree ("parent_document_id","version");--> statement-breakpoint
CREATE INDEX "idx_documents_uploaded_by" ON "documents" USING btree ("uploaded_by_id");--> statement-breakpoint
CREATE INDEX "idx_user_profiles_organization" ON "user_profiles" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_user_profiles_user" ON "user_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_profiles_role" ON "user_profiles" USING btree ("role");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_tenders_org_reference" ON "tenders" USING btree ("organization_id","reference_number");--> statement-breakpoint
CREATE INDEX "idx_tenders_status_closing" ON "tenders" USING btree ("status","closing_date");--> statement-breakpoint
CREATE INDEX "idx_tenders_client" ON "tenders" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "idx_tenders_category" ON "tenders" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_tenders_created_by" ON "tenders" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "idx_tenders_organization" ON "tenders" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_assigned_due" ON "tasks" USING btree ("assigned_to_id","due_date","is_completed");--> statement-breakpoint
CREATE INDEX "idx_tasks_tender" ON "tasks" USING btree ("tender_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_status" ON "tasks" USING btree ("is_completed","due_date");--> statement-breakpoint
CREATE INDEX "idx_reminder_rules_active" ON "reminder_rules" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_reminder_rules_days_before" ON "reminder_rules" USING btree ("days_before");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_unread" ON "notifications" USING btree ("user_id","is_read","created_at");--> statement-breakpoint
CREATE INDEX "idx_notifications_type" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_status_transitions" ON "allowed_status_transitions" USING btree ("from_status","to_status");--> statement-breakpoint
CREATE INDEX "idx_extension_history_time" ON "extension_history" USING btree ("extension_id","changed_at");--> statement-breakpoint
CREATE INDEX "idx_extension_reminders_scheduled" ON "extension_reminders" USING btree ("scheduled_for","is_active");--> statement-breakpoint
CREATE INDEX "idx_extensions_tender_status" ON "tender_extensions" USING btree ("tender_id","status");--> statement-breakpoint
CREATE INDEX "idx_extensions_deadline" ON "tender_extensions" USING btree ("current_deadline","status");--> statement-breakpoint
CREATE INDEX "idx_extensions_processed_by" ON "tender_extensions" USING btree ("processed_by_id");--> statement-breakpoint
CREATE INDEX "idx_extensions_received_date" ON "tender_extensions" USING btree ("received_at");