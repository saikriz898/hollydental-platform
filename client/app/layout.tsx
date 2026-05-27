import type { Metadata } from "next";
import "./globals.css";
import AuthModals from "@/components/auth/AuthModals";
import Toaster from "@/components/common/Toaster";
import Preloader from "@/components/public/Preloader";

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
      <body className="min-h-full flex flex-col bg-white text-navy selection:bg-gold/30">
        <Preloader />
        {children}
        <AuthModals />
        <Toaster />
      </body>
    </html>
  );
}
