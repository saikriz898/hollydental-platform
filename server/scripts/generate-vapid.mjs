import webpushDefault from "web-push";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const wp = webpushDefault.default || webpushDefault;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

if (/^VAPID_PUBLIC_KEY=/m.test(env) && /^VAPID_PRIVATE_KEY=/m.test(env)) {
  console.log("[vapid] keys already present in .env, nothing to do.");
  process.exit(0);
}

const keys = wp.generateVAPIDKeys();
const block = `\n# =========================================\n# VAPID KEYS FOR PUSH NOTIFICATIONS\n# =========================================\nVAPID_PUBLIC_KEY=${keys.publicKey}\nVAPID_PRIVATE_KEY=${keys.privateKey}\nVAPID_SUBJECT=mailto:contact@hollyhilldental.ie\n`;

fs.appendFileSync(envPath, block, "utf8");
console.log("[vapid] generated and appended VAPID keys to .env");
console.log("  public:", keys.publicKey);
