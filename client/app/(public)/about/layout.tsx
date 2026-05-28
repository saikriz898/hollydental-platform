import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Hollyhill Dental | Cork Cosmetic Dentistry",
  description:
    "Meet Dr. Roghay Alizadeh and the Hollyhill Dental team — Cork's premium cosmetic dental clinic, established in 2003.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
