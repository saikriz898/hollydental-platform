import app from "./app.js";
import { runMigrations } from "./db/migrate.js";
import { seedDatabase } from "./db/seed.js";
import dotenv from "dotenv";

dotenv.config();

// Global handlers to log unexpected errors and avoid silent crashes during
// development. In production you may prefer the process to exit so orchestrators
// can restart the service.
process.on("unhandledRejection", (reason, p) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled Promise Rejection:", reason, p);
});

process.on("uncaughtException", (err) => {
  // eslint-disable-next-line no-console
  console.error("Uncaught Exception:", err);
  // Do not attempt to recover from unknown exceptions in production.
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Run migrations if DB is active
    await runMigrations();

    // 2. Seed database
    await seedDatabase();

    // 3. Start Listening
    app.listen(PORT, () => {
      console.log(`Hollyhill Dental backend running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
    });
  } catch (error) {
    console.error("Failed to start Hollyhill Dental backend:", error);
    process.exit(1);
  }
};

startServer();
