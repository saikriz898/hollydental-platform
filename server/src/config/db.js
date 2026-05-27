import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema.js";
import { ENV } from "./env.js";

let db;

if (ENV.DATABASE_URL) {
  // Neon and most managed Postgres providers require SSL. We allow self-signed
  // certs because the cloud-managed CAs aren't always exposed to Node's trust
  // store, but we leave it OFF in production unless you opt in by setting
  // PGSSL_REJECT_UNAUTHORIZED=true (recommended once you've installed the
  // provider's root cert).
  const ssl = ENV.IS_PROD
    ? {
        rejectUnauthorized:
          process.env.PGSSL_REJECT_UNAUTHORIZED === "true" ? true : false,
      }
    : { rejectUnauthorized: false };

  const pool = new pg.Pool({
    connectionString: ENV.DATABASE_URL,
    ssl,
    max: 10,
    idleTimeoutMillis: 30_000,
  });
  // Prevent unhandled 'error' events from crashing the process. Log and allow
  // the application to decide how to handle transient DB errors.
  pool.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("[db] Postgres pool error:", err);
  });
  db = drizzle(pool, { schema });
  // eslint-disable-next-line no-console
  console.log("[db] connected to Postgres pool.");
} else {
  // eslint-disable-next-line no-console
  console.warn(
    "[db] DATABASE_URL is missing. Routes that need persistence will return 503."
  );
  // Throwing proxies prevent silent mock returns.
  const requireDb = () => {
    throw new Error("DATABASE_URL is not configured.");
  };
  db = new Proxy(
    {},
    {
      get() {
        return requireDb;
      },
    }
  );
}

export { db };
