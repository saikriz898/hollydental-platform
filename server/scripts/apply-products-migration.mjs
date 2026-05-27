import "dotenv/config";
import { db } from "../src/config/db.js";
import { sql } from "drizzle-orm";

await db.execute(
  sql.raw(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "price_to" numeric(10, 2)`)
);
await db.execute(
  sql.raw(
    `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "category" varchar(32) NOT NULL DEFAULT 'extra'`
  )
);
await db.execute(
  sql.raw(
    `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "display_order" integer NOT NULL DEFAULT 0`
  )
);
console.log("[migrate] products columns ensured.");
process.exit(0);
