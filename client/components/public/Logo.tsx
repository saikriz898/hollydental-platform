"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CLINIC } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";

interface LogoProps {
  /** "full" shows mark + wordmark, "icon" shows the mark only. */
  variant?: "full" | "icon";
  /** Color theme — light is for dark backgrounds, dark is for light backgrounds. */
  theme?: "dark" | "light";
  /** Render as a link (default true). Set false when used inside other Links. */
  asLink?: boolean;
  className?: string;
  /** Pixel size of the logo mark. Defaults to 36. */
  size?: number;
  /** Show the small uppercase tagline under the wordmark. */
  showTagline?: boolean;
  /**
   * Override the link target. By default the logo points home for guests
   * and to the role-aware dashboard for signed-in users.
   */
  href?: string;
}

export default function Logo({
  variant = "icon",
  theme = "dark",
  asLink = true,
  className = "",
  size = 36,
  showTagline = false,
  href,
}: LogoProps) {
  const { user } = useAuthStore();
  const [processedSrc, setProcessedSrc] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<number>(1.41);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/logo.png";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Loop through each pixel and key out dark grey/charcoal colors (the background of the logo)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const maxVal = Math.max(r, g, b);

        // Background is around #2a2c2f (RGB: 42, 44, 47)
        // We key out anything below 95 (dark grey/charcoal to black)
        if (maxVal < 95) {
          if (maxVal < 70) {
            data[i + 3] = 0; // Fully transparent
          } else {
            // Soft anti-aliasing edge blending
            const ratio = (maxVal - 70) / (95 - 70);
            data[i + 3] = Math.round(ratio * data[i + 3]);
          }
        }

        // Color inversion for dark backgrounds (theme="light")
        if (theme === "light" && data[i + 3] > 0) {
          // If the pixel is visible and is part of the dark navy text or crescent (maxVal < 160)
          if (maxVal < 160) {
            data[i] = 255;     // Red
            data[i + 1] = 255; // Green
            data[i + 2] = 255; // Blue
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Scan the image data to find the exact bounding box of non-transparent pixels
      let minX = canvas.width;
      let maxX = 0;
      let minY = canvas.height;
      let maxY = 0;
      let hasVisiblePixels = false;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          if (data[idx + 3] > 0) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            hasVisiblePixels = true;
          }
        }
      }

      if (hasVisiblePixels) {
        const croppedWidth = maxX - minX + 1;
        const croppedHeight = maxY - minY + 1;

        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = croppedWidth;
        croppedCanvas.height = croppedHeight;
        const croppedCtx = croppedCanvas.getContext("2d");
        if (croppedCtx) {
          croppedCtx.drawImage(
            canvas,
            minX,
            minY,
            croppedWidth,
            croppedHeight,
            0,
            0,
            croppedWidth,
            croppedHeight
          );
          setProcessedSrc(croppedCanvas.toDataURL("image/png"));
          setAspectRatio(croppedWidth / croppedHeight);
          return;
        }
      }

      // Fallback if no visible pixels are found
      setProcessedSrc(canvas.toDataURL("image/png"));
      setAspectRatio(canvas.width / canvas.height);
    };
  }, [theme]);

  const inner = (
    <>
      <span
        className="relative shrink-0 block transition-all"
        style={{ width: size * aspectRatio, height: size }}
      >
        {processedSrc ? (
          <img
            src={processedSrc}
            alt={`${CLINIC.name} logo`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-transparent" />
        )}
      </span>
    </>
  );

  const wrapperClass = `inline-flex items-center gap-2.5 group ${className}`;

  if (!asLink) {
    return <span className={wrapperClass}>{inner}</span>;
  }

  // Role-aware destination: an explicit `href` wins, otherwise signed-in
  // users go straight to their dashboard so clicking the brand mark from
  // anywhere never bounces them out of their authenticated area.
  const destination =
    href ||
    (user
      ? user.role === "admin"
        ? "/admin/dashboard"
        : "/portal/dashboard"
      : "/");

  return (
    <Link href={destination} className={wrapperClass} aria-label={CLINIC.name}>
      {inner}
    </Link>
  );
}
