-- Adds price ranges, storefront category, and a manual sort key to products
-- so we can model both chairside procedures (e.g. "Dental Bonding €120 – €180")
-- and fixed-price retail extras under the same table.

ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "price_to" numeric(10, 2);

ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "category" varchar(32) NOT NULL DEFAULT 'extra';

ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "display_order" integer NOT NULL DEFAULT 0;
