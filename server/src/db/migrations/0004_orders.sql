-- 0004: products + orders. Hand-written migration that is idempotent so it
-- catches up legacy databases where products may already exist (with a
-- different shape) or be missing entirely.

-- Products (created earlier in some legacy deployments — guard with IF NOT
-- EXISTS so this migration is safe to re-run).
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"image_url" text,
	"stock_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"patient_id" uuid,
	"product_id" uuid,
	"product_name" varchar(255) NOT NULL,
	"unit_price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"total_amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"payment_method" varchar(20) DEFAULT 'cash' NOT NULL,
	"upi_reference" varchar(80),
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"customer_name" varchar(255),
	"customer_phone" varchar(80),
	"customer_email" varchar(255),
	"notes" text,
	"paid_at" timestamp,
	"fulfilled_at" timestamp,
	"cancelled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders" ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_user_id_idx" ON "orders" ("user_id");
