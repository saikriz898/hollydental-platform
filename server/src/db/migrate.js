import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../config/db.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const migrationsFolder = resolve(__dirname, "migrations");

export const runMigrations = async () => {
  if (process.env.DATABASE_URL) {
    try {
      console.log("Running migrations...");
      // Runs migrations from migrations folder
      await migrate(db, { migrationsFolder });
      console.log("Migrations ran successfully.");
    } catch (error) {
      console.error("Migration failed:", error);
    }
  } else {
    console.log("[MOCK MIGRATION] Skipped migrations (mock mode).");
  }
};
