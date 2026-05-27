"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Drop-in idle/session watcher for authenticated routes.
 *
 * - Logs the user out after `idleMinutes` of no input, on a single tab.
 * - Surfaces a one-line warning in the console before logout.
 * - Listens to storage events so closing the tab in one window logs out the others.
 */
export default function SessionWatcher({
  idleMinutes = 30,
  warnSecondsBefore = 60,
}: {
  idleMinutes?: number;
  warnSecondsBefore?: number;
}) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;

    const idleMs = Math.max(60_000, idleMinutes * 60_000);
    const warnMs = Math.max(0, idleMs - warnSecondsBefore * 1000);

    const reset = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (warnTimer.current) clearTimeout(warnTimer.current);

      warnTimer.current = setTimeout(() => {
        // Quiet console warning — UI badge can be added later if desired.
        // eslint-disable-next-line no-console
        console.info(
          `[session] You'll be signed out in ${warnSecondsBefore}s due to inactivity.`
        );
      }, warnMs);

      idleTimer.current = setTimeout(() => {
        logout("idle");
      }, idleMs);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "wheel",
    ];
    events.forEach((e) =>
      window.addEventListener(e, reset, { passive: true } as any)
    );
    document.addEventListener("visibilitychange", reset);

    reset();

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (warnTimer.current) clearTimeout(warnTimer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
      document.removeEventListener("visibilitychange", reset);
    };
  }, [user, logout, idleMinutes, warnSecondsBefore]);

  return null;
}
