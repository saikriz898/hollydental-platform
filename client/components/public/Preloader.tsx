"use client";

import { useEffect, useRef, useState } from "react";
import { CLINIC } from "@/lib/constants";
import Logo from "@/components/public/Logo";

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isDev = process.env.NODE_ENV !== "production";
    const seenKey = `hh-intro-seen-v${INTRO_VERSION}`;
    const seen =
      !isDev && window.sessionStorage.getItem(seenKey) === "1";

    if (seen) {
      setRemoved(true);
      return;
    }

    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => setHidden(true), 1500);
    const removeTimer = window.setTimeout(() => {
      setRemoved(true);
      document.body.style.overflow = "";
      try {
        window.sessionStorage.setItem(seenKey, "1");
      } catch {
        // sessionStorage may be unavailable in some embeds — ignore.
      }
    }, 2000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] bg-navy text-white flex items-center justify-center transition-opacity duration-700 ease-out ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Ambient Moving Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#00ADEF]/10 blur-[90px] animate-[preloader-blob_8s_infinite_alternate]" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-gold/10 blur-[80px] animate-[preloader-blob_10s_infinite_alternate-reverse_2s]" />
      
      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30" />

      <div className="relative flex flex-col items-center gap-9 px-6 text-center z-10">
        
        {/* Transparent Logo Container */}
        <div className="relative animate-[preloader-pulse_3s_infinite_ease-in-out] py-4">
          <Logo size={96} theme="light" asLink={false} />
        </div>

        <div className="space-y-3">
          <span className="inline-block text-[9px] uppercase tracking-[0.45em] font-bold text-gold bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20">
            {CLINIC.taglineShort || "Smile Confidently"}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white">
            {CLINIC.name}
          </h1>
          <span className="block text-[11px] text-gray-400 max-w-xs font-light leading-relaxed">
            {CLINIC.tagline || "Creating Beautiful & Confident Smiles"}
          </span>
        </div>

        {/* Premium glowing loading bar */}
        <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(201,169,110,0.1)]">
          <div className="h-full w-2/3 bg-gradient-to-r from-transparent via-gold to-transparent absolute top-0 -translate-x-[120%] animate-[preloader-shimmer_1.8s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes preloader-shimmer {
          0% {
            transform: translateX(-150%);
          }
          50% {
            transform: translateX(150%);
          }
          100% {
            transform: translateX(150%);
          }
        }
        @keyframes preloader-blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(30px, -50px) scale(1.1);
          }
          100% {
            transform: translate(-10px, 30px) scale(0.95);
          }
        }
        @keyframes preloader-pulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 15px rgba(0, 173, 239, 0.05));
          }
          50% {
            transform: scale(1.015);
            filter: drop-shadow(0 0 25px rgba(0, 173, 239, 0.15));
          }
        }
      `}</style>
    </div>
  );
}
