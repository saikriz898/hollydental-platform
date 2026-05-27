"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CLINIC } from "@/lib/constants";

/**
 * Premium intro splash. Shown once per browser session per intro version.
 * Bumping `INTRO_VERSION` re-triggers the splash for everyone.
 *
 * In development the gate is bypassed so designers can iterate on the
 * animation without clearing storage manually.
 */
const INTRO_VERSION = "2"; // bump to force everyone to see a refreshed intro

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return; // guard against React strict-mode double-fire
    startedRef.current = true;

    if (typeof window === "undefined") return;

    const isDev = process.env.NODE_ENV !== "production";
    const seenKey = `hh-intro-seen-v${INTRO_VERSION}`;
    const seen =
      !isDev && window.sessionStorage.getItem(seenKey) === "1";

    if (seen) {
      setRemoved(true);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => setHidden(true), 1500);
    const removeTimer = window.setTimeout(() => {
      setRemoved(true);
      document.body.style.overflow = prevOverflow;
      try {
        window.sessionStorage.setItem(seenKey, "1");
      } catch {
        // sessionStorage may be unavailable in some embeds — ignore.
      }
    }, 2000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] bg-navy text-white flex items-center justify-center transition-opacity duration-500 ease-out ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Ambient gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(201,169,110,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(201,169,110,0.10),transparent_60%)]" />

      <div className="relative flex flex-col items-center gap-7 px-6 text-center">
        {/* Logo emblem with rotating gold ring */}
        <div className="relative w-28 h-28">
          <span className="absolute inset-0 rounded-full border border-gold/20" />
          <span className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent border-t-gold border-r-gold/40 animate-[spin_2s_linear_infinite]" />
          <span className="absolute inset-2 rounded-full border border-gold/15" />
          <span className="absolute inset-3 rounded-full bg-white shadow-[0_8px_24px_-6px_rgba(201,169,110,0.5)] flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt={`${CLINIC.name} logo`}
              width={72}
              height={72}
              priority
              className="w-[78%] h-[78%] object-contain"
            />
          </span>
        </div>

        <div className="space-y-2">
          <span className="block text-[10px] uppercase tracking-[0.4em] font-semibold text-gold">
            {CLINIC.taglineShort || "Smile Confidently"}
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
            {CLINIC.name}
          </h1>
          <span className="block text-[11px] text-gray-400 max-w-xs">
            {CLINIC.tagline || "Creating Beautiful & Confident Smiles"}
          </span>
        </div>

        {/* Loading bar */}
        <div className="w-44 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-gold/0 via-gold to-gold/0 animate-[preloader-shimmer_1.2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes preloader-shimmer {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(220%);
          }
        }
      `}</style>
    </div>
  );
}
