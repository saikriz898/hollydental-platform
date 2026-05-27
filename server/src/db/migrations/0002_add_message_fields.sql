ALTER TABLE "messages" ADD COLUMN "read_at" timestamp;
ALTER TABLE "messages" ADD COLUMN "deleted_at" timestamp;
ALTER TABLE "messages" ADD COLUMN "deleted_by" uuid;

DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
