#!/usr/bin/env node
/**
 * Wipes user / demo data while keeping the things you actually need:
 *   - all schema tables and their structure
 *   - reference services
 *   - product catalog (admin-managed)
 *   - admin / doctor user accounts (so you don't lose your login)
 *
 * What gets removed:
 *   - patient profiles + linked users
 *   - appointments, treatments, dental charts, prescriptions
 *   - invoices, files, push subscriptions
 *   - chat messages, audit logs, password reset tokens, newsletter subs
 *   - orders
 *
 * Usage:
 *   npm run db:reset                 (asks for confirmation via stdin)
 *   npm run db:reset -- --yes        (skip confirmation, for scripts/CI)
 *   npm run db:reset -- --keep-blog  (preserve blog posts as well)
 */
import "dotenv/config";
import readline from "readline";
import { ne, eq, sql } from "drizzle-orm";
import { db } from "../src/config/db.js";
import {
  users,
  patients,
  appointments,
  treatments,
  dentalCharts,
  invoices,
  files,
  prescriptions,
  messages,
  blogPosts,
  auditLogs,
  pushSubscriptions,
  passwordResetTokens,
  newsletterSubscribers,
  orders,
} from "../src/db/schema.js";

function parseArgs(argv) {
  const out = { yes: false, keepBlog: false };
  for (const arg of argv) {
    if (arg === "--yes" || arg === "-y") out.yes = true;
    else if (arg === "--keep-blog") out.keepBlog = true;
  }
  return out;
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("[reset-db] DATABASE_URL is not set. Aborting.");
    process.exit(1);
  }

  const args = parseArgs(process.argv.slice(2));

  console.log(
    "[reset-db] This will delete patient, appointment, message, invoice, prescription, file, audit, and order rows."
  );
  console.log(
    "[reset-db] Services, products, and admin/doctor users will be kept."
  );
  if (args.keepBlog) {
    console.log("[reset-db] Blog posts will be kept (--keep-blog).");
  } else {
    console.log("[reset-db] Blog posts will be removed.");
  }

  if (!args.yes) {
    const answer = await ask("Type YES to continue: ");
    if (answer !== "yes") {
      console.log("[reset-db] Aborted by user.");
      process.exit(0);
    }
  }

  // Order matters: delete dependents before parents to respect FK chains.
  // The schema also uses ON DELETE CASCADE for the patient-rooted tables,
  // but explicit deletes give clearer logs and don't require us to know
  // every cascade path.

  console.log("[reset-db] Deleting transactional data…");
  await db.delete(orders);
  await db.delete(passwordResetTokens);
  await db.delete(pushSubscriptions);
  await db.delete(auditLogs);
  await db.delete(messages);
  await db.delete(prescriptions);
  await db.delete(treatments);
  await db.delete(dentalCharts);
  await db.delete(files);
  await db.delete(invoices);
  await db.delete(appointments);
  await db.delete(newsletterSubscribers);

  if (!args.keepBlog) {
    await db.delete(blogPosts);
  }

  console.log("[reset-db] Removing patients…");
  // Capture user ids attached to patients so we can clean up their auth rows.
  const patientUsers = await db
    .select({ userId: patients.userId })
    .from(patients);
  await db.delete(patients);

  // Delete ONLY non-admin user accounts. Admin/doctor logins are preserved.
  console.log("[reset-db] Removing non-admin user accounts…");
  await db.delete(users).where(ne(users.role, "admin"));

  console.log("[reset-db] Done. Surviving rows:");
  const [{ count: userCount }] = await db
    .select({ count: sql`count(*)::int` })
    .from(users);
  console.log(`  users (admin/doctor): ${userCount}`);
  console.log(
    `  detached patient->user references cleaned implicitly (cascade)`
  );
  console.log(
    `  patient-linked user rows seen before delete: ${patientUsers.length}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[reset-db] Failed:", err);
    process.exit(1);
  });
