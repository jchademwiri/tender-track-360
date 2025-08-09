CREATE INDEX "idx_categories_org_active" ON "tender_categories" USING btree ("organization_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_categories_system_active" ON "tender_categories" USING btree ("is_system_default","is_active");--> statement-breakpoint
CREATE INDEX "idx_clients_org_active" ON "clients" USING btree ("organization_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_clients_created_by" ON "clients" USING btree ("created_by_id");