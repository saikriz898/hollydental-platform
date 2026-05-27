"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import {
  enablePushNotifications,
  disablePushNotifications,
  isPushSupported,
} from "@/lib/push";

type State = "unsupported" | "denied" | "default" | "granted" | "subscribed";

interface PushToggleProps {
  /** Compact pill button (header) vs full card layout (settings/profile). */
  variant?: "pill" | "card";
  className?: string;
}

export default function PushToggle({
  variant = "pill",
  className = "",
}: PushToggleProps) {
  const [state, setState] = useState<State>("default");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPushSupported()) {
      setState("unsupported");
      return;
    }
    const permission = Notification.permission as
      | "default"
      | "denied"
      | "granted";

    if (permission === "denied") {
      setState("denied");
      return;
    }

    if (permission === "granted") {
      navigator.serviceWorker
        .getRegistration()
        .then((reg) => reg?.pushManager.getSubscription())
        .then((sub) => {
          setState(sub ? "subscribed" : "granted");
        })
        .catch(() => setState("granted"));
      return;
    }

    setState("default");
  }, []);

  const handleEnable = async () => {
    setBusy(true);
    setError(null);
    try {
      const ok = await enablePushNotifications();
      setState(ok ? "subscribed" : "denied");
      if (!ok) {
        setError(
          "We couldn't enable push notifications. Check your browser settings and try again."
        );
      }
    } catch (err: any) {
      setError(err?.message || "Failed to enable notifications.");
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    setBusy(true);
    setError(null);
    try {
      await disablePushNotifications();
      setState("granted");
    } catch (err: any) {
      setError(err?.message || "Failed to disable notifications.");
    } finally {
      setBusy(false);
    }
  };

  if (state === "unsupported") {
    if (variant === "card") {
      return (
        <div className={`text-xs text-gray-500 ${className}`}>
          Push notifications aren&apos;t supported in this browser.
        </div>
      );
    }
    return null;
  }

  const isOn = state === "subscribed";

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={isOn ? handleDisable : handleEnable}
        disabled={busy || state === "denied"}
        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 ${
          isOn
            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            : "bg-gold/10 text-gold hover:bg-gold/20"
        } ${className}`}
        title={
          state === "denied"
            ? "Notifications are blocked in your browser settings."
            : isOn
            ? "Disable push notifications"
            : "Enable push notifications"
        }
      >
        {isOn ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">
          {busy
            ? "…"
            : state === "denied"
            ? "Blocked"
            : isOn
            ? "Notifications on"
            : "Enable alerts"}
        </span>
      </button>
    );
  }

  return (
    <div
      className={`border border-gray-100 bg-white rounded-2xl p-5 shadow-sm space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isOn
                ? "bg-emerald-50 text-emerald-600"
                : "bg-gold/10 text-gold"
            }`}
          >
            {isOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </span>
          <div>
            <h3 className="font-serif text-sm font-bold text-navy">
              Push notifications
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Get appointment confirmations, status updates and password
              reset codes pushed to this device.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={isOn ? handleDisable : handleEnable}
          disabled={busy || state === "denied"}
          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
            isOn
              ? "bg-gray-100 text-navy hover:bg-gray-200"
              : "bg-gold text-navy hover:bg-gold-dark"
          }`}
        >
          {busy ? "…" : isOn ? "Disable" : "Enable"}
        </button>
      </div>
      {state === "denied" && (
        <p className="text-[11px] text-red-500">
          Notifications are currently blocked in your browser. Update the site
          permissions to allow them.
        </p>
      )}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
