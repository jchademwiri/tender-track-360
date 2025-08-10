ALTER TABLE "user_preferences" ADD COLUMN "push_notifications" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "language" varchar(10) DEFAULT 'en';--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "date_format" varchar(20) DEFAULT 'MM/dd/yyyy';--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "time_format" varchar(10) DEFAULT '12h';--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_deleted_by_id_user_id_fk" FOREIGN KEY ("deleted_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_user_preferences_user" ON "user_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_profiles_active" ON "user_profiles" USING btree ("is_active","organization_id");--> statement-breakpoint
CREATE INDEX "idx_user_profiles_department" ON "user_profiles" USING btree ("department","organization_id");--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id");