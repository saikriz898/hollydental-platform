import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Hollyhill Aesthetic Clinic | Luxury Skin & Aesthetic Clinic",
  description: "Premium aesthetic clinic offering advanced skin treatments, facial aesthetics, anti-aging procedures, and cosmetic consultations.",
  keywords: [
    "aesthetic clinic",
    "cosmetic clinic",
    "skin clinic",
    "anti-aging treatments",
    "dental clinic",
    "facial aesthetics",
    "Hollyhill Aesthetic Clinic",
    "Cork clinic",
    "Ireland"
  ],
  alternates: {
    canonical: "https://hollyhilldental.ie",
  },
  openGraph: {
    title: "Hollyhill Aesthetic Clinic | Luxury Skin & Aesthetic Clinic",
    description: "Premium aesthetic clinic offering advanced skin treatments, facial aesthetics, anti-aging procedures, and cosmetic consultations.",
    url: "https://hollyhilldental.ie",
    siteName: "Hollyhill Aesthetic Clinic",
    locale: "en_IE",
    type: "website",
  },
};

export default function HomePage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      "@id": "https://hollyhilldental.ie/#clinic",
      "name": "Hollyhill Aesthetic & Dental Clinic",
      "alternateName": "Hollyhill Aesthetic Clinic",
      "image": "https://hollyhilldental.ie/logo.png",
      "url": "https://hollyhilldental.ie",
      "telephone": "+353214303072",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Unit 6, Hollyhill Shopping Centre",
        "addressLocality": "Cork",
        "addressCountry": "IE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "51.9069",
        "longitude": "-8.5085"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://hollyhilldental.ie/#local-business",
      "name": "Hollyhill Aesthetic & Dental Clinic",
      "image": "https://hollyhilldental.ie/logo.png",
      "priceRange": "$$",
      "telephone": "+353214303072",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Unit 6, Hollyhill Shopping Centre",
        "addressLocality": "Cork",
        "addressCountry": "IE"
      }
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <HomeClient />
    </>
  );
}

