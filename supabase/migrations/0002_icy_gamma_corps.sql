ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "tenders" ALTER COLUMN "publication_date" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "tenders" ALTER COLUMN "submission_deadline" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "tenders" ALTER COLUMN "evaluation_date" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "tenders" ALTER COLUMN "award_date" SET DATA TYPE varchar;