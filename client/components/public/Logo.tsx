"use client";

import Link from "next/link";
import Image from "next/image";
import { CLINIC } from "@/lib/constants";

interface LogoProps {
  /** "full" shows mark + wordmark, "icon" shows the mark only. */
  variant?: "full" | "icon";
  /** Color theme — light is for dark backgrounds, dark is for light backgrounds. */
  theme?: "dark" | "light";
  /** Render as a link to "/" (default true). Set false when used inside other Links. */
  asLink?: boolean;
  className?: string;
  /** Pixel size of the logo mark. Defaults to 36. */
  size?: number;
  /** Show the small uppercase tagline under the wordmark. */
  showTagline?: boolean;
}

/**
 * Brand mark for Hollyhill Dental.
 *
 * The PNG mark sits inside a soft white plate so it stays crisp on both
 * light and dark surfaces (the source PNG has internal whitespace and
 * looks washed out otherwise). A faint gold ring grows on hover for a
 * subtle premium accent.
 */
export default function Logo({
  variant = "full",
  theme = "dark",
  asLink = true,
  className = "",
  size = 36,
  showTagline = true,
}: LogoProps) {
  const wordmarkColor = theme === "light" ? "text-white" : "text-navy";
  const taglineColor = theme === "light" ? "text-gold/90" : "text-gold";

  const inner = (
    <>
      {/* Mark — circular plate so it reads on both navy and white surfaces */}
      <span
        className="relative shrink-0 rounded-full bg-white shadow-[0_2px_8px_-2px_rgba(10,22,40,0.15)] ring-1 ring-gold/15 group-hover:ring-gold/40 transition-all"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt={`${CLINIC.name} logo`}
          fill
          sizes={`${size}px`}
          className="object-contain p-[14%]"
          priority
        />
      </span>

      {variant === "full" && (
        <span className="hidden sm:flex flex-col leading-none">
          <span
            className={`font-serif text-[15px] md:text-[17px] font-bold tracking-tight ${wordmarkColor} group-hover:opacity-90 transition-opacity`}
            style={{ letterSpacing: "0.005em" }}
          >
            {CLINIC.name}
          </span>
          {showTagline && (
            <span
              className={`text-[9px] md:text-[10px] font-semibold tracking-[0.22em] uppercase mt-1.5 ${taglineColor}`}
            >
              {CLINIC.taglineShort}
            </span>
          )}
        </span>
      )}
    </>
  );

  const wrapperClass = `inline-flex items-center gap-2.5 group ${className}`;

  if (!asLink) {
    return <span className={wrapperClass}>{inner}</span>;
  }

  return (
    <Link href="/" className={wrapperClass} aria-label={CLINIC.name}>
      {inner}
    </Link>
  );
}
