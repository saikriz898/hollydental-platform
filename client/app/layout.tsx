import type { Metadata } from "next";
import "./globals.css";
import AuthModals from "@/components/auth/AuthModals";
import Toaster from "@/components/common/Toaster";
import Preloader from "@/components/public/Preloader";
import fs from "fs";
import path from "path";

// Execute copy of assets on startup
try {
  const destDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const brainDir = "C:\\Users\\saikr\\.gemini\\antigravity-ide\\brain\\4966e2ed-f7d6-4f31-a176-2d6c2f3e12f0";

  // Helper function to copy if source exists
  const copyAsset = (srcName: string, destName: string) => {
    const srcPath = path.join(brainDir, srcName);
    const destPath = path.join(destDir, destName);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Successfully copied ${srcName} -> ${destName}`);
    }
  };

  // Copy dental implant image
  copyAsset("dental_implant_1779939669300.png", "dental-implants.png");

  // Copy storefront image
  copyAsset("media__1779941739177.png", "clinic-storefront.png");

  // Copy dentist mirror image
  copyAsset("media__1779941712712.png", "dentist-mirror.png");

  // Copy cosmetic icon image
  copyAsset("media__1779943161030.png", "cosmetic-icon.png");

  // Copy Patient J.S. Before/After images
  copyAsset("media__1779942579666.png", "image-js-before.png");
  copyAsset("media__1779942779153.png", "image-js-after.png");

  // Copy mobile background video
  const videoSrc = "c:\\Users\\saikr\\Downloads\\hollydental-platform-main\\hollydental-platform-main\\fb75f8c5-8a53-4bee-893a-df705c29b3fd_0.mp4";
  const videoDest = path.join(destDir, "hero-mobile.mp4");
  if (fs.existsSync(videoSrc)) {
    fs.copyFileSync(videoSrc, videoDest);
    console.log("Successfully copied hero-mobile.mp4 to public folder.");
  }
} catch (err) {
  console.error("Failed to copy startup assets:", err);
}

export const metadata: Metadata = {
  title: "Hollyhill Dental Cork | Dr. Roghay Alizadeh | Confident Smiles",
  description: "Experience premium, luxury clinical care at Hollyhill Dental Clinic, Cork. Specializing in teeth whitening, clear aligners, bonding, and emergency dentistry under Dr. Roghay Alizadeh.",
  keywords: ["dentist Cork", "cosmetic dentistry Ireland", "Invisalign Cork", "composite bonding Cork", "teeth whitening Cork", "Dr Roghay Alizadeh", "Hollyhill Dental"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col bg-white text-navy selection:bg-gold/30"
        suppressHydrationWarning
      >
        <Preloader />
        {children}
        <AuthModals />
        <Toaster />
      </body>
    </html>
  );
}
