import type { Metadata } from "next";
import TreatmentPageTemplate from "@/components/public/TreatmentPageTemplate";

export const metadata: Metadata = {
  title: "Botox Treatment Cork | Premium Anti-Wrinkle Injections | Hollyhill Aesthetic Clinic",
  description: "Transform your appearance with premium Botox injections in Cork. Treat forehead lines, crow's feet, and wrinkles under Dr. Roghay Alizadeh's expert care. Book online today.",
  keywords: ["Botox Cork", "anti-wrinkle injections Cork", "facial aesthetics Cork", "forehead lines treatment", "anti-aging treatments"],
};

export default function BotoxPage() {
  return (
    <TreatmentPageTemplate
      slug="botox"
      treatmentName="Botox Injections"
      heroTitle="Smooth, youthful skin with premium Botox injections"
      heroSubtitle="Soften expression lines, prevent fine wrinkles, and restore confidence under Cork's premier cosmetic clinic."
      heroImage="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600"
      descriptionText={`Botox (Botulinum Toxin) is a safe, FDA-approved, non-surgical treatment that temporarily relaxes the muscles responsible for creating fine lines and wrinkles. Over time, continuous muscle contractions from expressions like frowning, smiling, or squinting cause deep creases in the skin. Botox relaxes these muscles, smoothing existing lines and preventing new ones from setting.

Our treatment is highly customized. Dr. Roghay Alizadeh uses micro-dosing techniques to soften wrinkles while maintaining natural facial expressions, ensuring you look refreshed and rejuvenated, never 'frozen'.`}
      benefits={[
        "Smooths forehead wrinkles, frown lines, and crow's feet.",
        "Prevents the formation of future deep static creases.",
        "Non-surgical with minimal discomfort during the procedure.",
        "Quick 15-minute treatment sessions.",
        "Delivers natural-looking, refreshed cosmetic results."
      ]}
      procedureSteps={[
        {
          title: "Aesthetic Consultation",
          description: "Dr. Alizadeh reviews your facial structure, muscle movement, and goals to plan custom injection points."
        },
        {
          title: "Comfort & Preparation",
          description: "The skin is sanitized and a local numbing cream is applied to ensure a comfortable, pinch-free procedure."
        },
        {
          title: "Micro-injections",
          description: "Using ultra-fine needles, precise doses of premium Botulinum Toxin are injected into targeted muscles."
        }
      ]}
      recoveryTime="No downtime. Avoid strenuous exercise, hot showers, saunas, and lying down flat for 4 hours post-treatment. Normal activity can be resumed immediately. Results begin appearing in 3-5 days, with full results visible at 14 days."
      faqs={[
        {
          q: "How long does Botox last?",
          a: "Typically, Botox results last between 3 to 4 months. Over time, muscle action gradually returns and wrinkles will begin to reappear, at which point a maintenance treatment is recommended."
        },
        {
          q: "Does the injection hurt?",
          a: "Most patients describe the sensation as a quick, mild pinch. We use ultra-fine needles and can apply a topical anesthetic to ensure you are comfortable throughout."
        },
        {
          q: "Are there any side effects?",
          a: "Temporary swelling, redness, or small bruises at the injection site are normal and resolve in a few hours. Rare side effects will be fully discussed during your initial consultation."
        }
      ]}
      beforeImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=500"
      afterImage="https://images.unsplash.com/photo-1522337060762-f47009d3759a?auto=format&fit=crop&q=80&w=500"
      durationMins={15}
      priceFrom={220}
    />
  );
}
