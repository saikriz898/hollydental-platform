/**
 * Web Push helper. Sends notifications to every active push subscription
 * a user has registered. Subscriptions that respond with 404/410 are
 * removed so we don't keep retrying them.
 */
import { db } from "../config/db.js";
import { pushSubscriptions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import webpushDefault from "web-push";

const webpush = webpushDefault.default || webpushDefault;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

let configured = false;

function initializeVapidKeys() {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    return true;
  }

  try {
    const keys = webpush.generateVAPIDKeys();

    // Set in environment so the running process can use them immediately.
    process.env.VAPID_PUBLIC_KEY = keys.publicKey;
    process.env.VAPID_PRIVATE_KEY = keys.privateKey;

    // Persist to .env so the keys survive restarts. We only append if the
    // file exists and doesn't already contain VAPID entries (a previous
    // partial run or manual edit).
    try {
      if (fs.existsSync(envPath)) {
        const current = fs.readFileSync(envPath, "utf8");
        if (
          !/^VAPID_PUBLIC_KEY=/m.test(current) &&
          !/^VAPID_PRIVATE_KEY=/m.test(current)
        ) {
          const suffix = `\n# =========================================\n# VAPID KEYS FOR PUSH NOTIFICATIONS (AUTO-GENERATED)\n# =========================================\nVAPID_PUBLIC_KEY=${keys.publicKey}\nVAPID_PRIVATE_KEY=${keys.privateKey}\nVAPID_SUBJECT=${process.env.VAPID_SUBJECT || "mailto:contact@hollyhilldental.ie"}\n`;
          fs.appendFileSync(envPath, suffix, "utf8");
          console.log("[push] Auto-generated VAPID keys and appended to .env");
        }
      }
    } catch (writeErr) {
      // Non-fatal — the in-memory keys still let push work for this process.
      console.warn(
        "[push] Generated VAPID keys but failed to persist to .env:",
        writeErr.message
      );
    }

    return true;
  } catch (error) {
    console.error("[push] Failed to auto-generate VAPID keys:", error);
    return false;
  }
}

// Generate on module load so the public-key endpoint works on the first
// request after boot.
initializeVapidKeys();

async function ensureConfigured() {
  if (configured) return webpush;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:contact@hollyhilldental.ie";
  if (!publicKey || !privateKey) {
    return null;
  }
  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    configured = true;
    return webpush;
  } catch (err) {
    console.error("[push] failed to configure web-push:", err.message);
    return null;
  }
}

export function getVapidPublicKey() {
  if (!process.env.VAPID_PUBLIC_KEY) {
    // Self-heal in case the keys weren't initialised at boot (e.g. the env
    // file was missing or the module was imported before keys existed).
    initializeVapidKeys();
  }
  return process.env.VAPID_PUBLIC_KEY || null;
}

/**
 * Send a Web Push notification payload to every active subscription owned
 * by `userId`. Returns the number of subscriptions reached.
 */
export async function sendPush(userId, payload) {
  if (!process.env.DATABASE_URL) return 0;
  if (!userId) return 0;
  const wp = await ensureConfigured();
  if (!wp) return 0;

  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  if (subs.length === 0) return 0;

  const body = JSON.stringify({
    title: payload?.title || "Hollyhill Dental",
    body: payload?.body || "",
    url: payload?.url || "/portal/dashboard",
    icon: payload?.icon || "/logo.png",
    badge: payload?.badge || "/logo.png",
    tag: payload?.tag,
    timestamp: Date.now(),
  });

  let delivered = 0;
  await Promise.all(
    subs.map(async (sub) => {
      try {
        await wp.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body
        );
        delivered += 1;
      } catch (err) {
        const status = err?.statusCode;
        // Subscription is gone — clean it up.
        if (status === 404 || status === 410) {
          try {
            await db
              .delete(pushSubscriptions)
              .where(eq(pushSubscriptions.id, sub.id));
          } catch (_) {
            // ignore cleanup error
          }
        } else {
          console.error("[push] send failed:", status, err?.message);
        }
      }
    })
  );

  return delivered;
}
