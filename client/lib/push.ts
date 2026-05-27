"use client";

import { apiRequest } from "@/lib/api";

/**
 * Web Push helper. Registers our service worker, asks the browser for
 * notification permission, and persists the resulting PushSubscription on
 * the server so the clinic can deliver alerts (booking confirmations,
 * password reset codes, etc.).
 */

function urlBase64ToUint8Array(base64: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalised = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = typeof window !== "undefined" ? window.atob(normalised) : "";
  const buf = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i += 1) view[i] = raw.charCodeAt(i);
  return buf;
}

export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function getPushPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

async function getServiceWorker(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration();
  if (existing) return existing;
  return navigator.serviceWorker.register("/sw.js");
}

/**
 * Request push permission and register a subscription. Returns true on
 * success, false if the user declined or the browser refused.
 */
export async function enablePushNotifications(): Promise<boolean> {
  if (!isPushSupported()) return false;

  let publicKey: string;
  try {
    const data = await apiRequest("/push/public-key");
    publicKey = data?.key;
  } catch (err) {
    console.warn("[push] public-key fetch failed", err);
    throw err;
  }
  if (!publicKey) return false;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  const registration = await getServiceWorker();
  await navigator.serviceWorker.ready;

  let sub = await registration.pushManager.getSubscription();
  if (!sub) {
    sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  const json = sub.toJSON() as {
    endpoint?: string;
    keys?: { p256dh?: string; auth?: string };
  };

  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return false;

  await apiRequest("/push/subscribe", {
    method: "POST",
    body: JSON.stringify({
      endpoint: json.endpoint,
      keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    }),
  });

  return true;
}

export async function disablePushNotifications(): Promise<boolean> {
  if (!isPushSupported()) return false;
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return true;
  const sub = await registration.pushManager.getSubscription();
  if (!sub) return true;

  try {
    await apiRequest("/push/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ endpoint: sub.endpoint }),
    });
  } catch (err) {
    console.warn("[push] unsubscribe server failed", err);
  }
  await sub.unsubscribe();
  return true;
}
