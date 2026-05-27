import type { Metadata } from "next";
import TreatmentPageTemplate from "@/components/public/TreatmentPageTemplate";

export const metadata: Metadata = {
  title: "Professional Teeth Whitening Cork | Hollyhill Aesthetic Clinic",
  description: "Brighten your smile up to 8 shades with professional, safe teeth whitening in Cork. Customized home trays and in-chair treatments under Dr. Roghay Alizadeh.",
  keywords: ["teeth whitening Cork", "teeth bleaching Cork", "smile whitening Cork", "laser teeth whitening", "cosmetic dentistry whitening"],
};

export default function TeethWhiteningPage() {
  return (
    <TreatmentPageTemplate
      slug="teeth-whitening"
      treatmentName="Teeth Whitening"
      heroTitle="A brighter, more confident smile in just one visit"
      heroSubtitle="Soften years of stains and brighten your teeth safely by up to 8 shades with professional whitening in Cork."
      heroImage="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600"
      descriptionText={`Professional Teeth Whitening is a safe, effective, and minimally invasive cosmetic dental treatment designed to lift deep stains and discoloration from your teeth. Unlike over-the-counter kits that can damage tooth enamel and irritate gums, our professional bleaching treatments are fully customized and supervised by Dr. Roghay Alizadeh.

We offer premium in-chair power whitening (achieving results in 1 hour) as well as custom-molded take-home whitening trays. Both systems use advanced, enamel-safe hydrogen peroxide formulas to break down stain molecules from coffee, tea, red wine, and aging.`}
      benefits={[
        "Brightens teeth up to 8 shades for a radiant smile.",
        "Customized trays prevent chemical contact with sensitive gums.",
        "Fast, predictable results that last for years.",
        "Lifts deep stains caused by aging, coffee, smoking, and food.",
        "100% enamel-safe and medically supervised."
      ]}
      procedureSteps={[
        {
          title: "Shade Analysis & Checkup",
          description: "We clean your teeth, record your starting shade, and ensure you have no active tooth decay or gum disease."
        },
        {
          title: "Custom Impressions",
          description: "We take digital impressions of your teeth to create custom-molded whitening trays that fit your teeth perfectly."
        },
        {
          title: "Whitening Session",
          description: "We apply a protective barrier to your gums, lay the bleaching gel, and activate it with a specialized LED light."
        }
      ]}
      recoveryTime="Minor tooth sensitivity to hot and cold liquids is normal for 24-48 hours. Follow the 'white diet' (avoid coffee, red wine, curry, and dark-colored foods) for 48 hours post-whitening to allow the enamel to reseal. Use sensitive toothpaste."
      faqs={[
        {
          q: "Is teeth whitening safe for enamel?",
          a: "Yes, professional teeth whitening is completely safe. The active ingredients open pores in the tooth structure to release stain molecules, without stripping or thinning the enamel."
        },
        {
          q: "How long do whitening results last?",
          a: "Generally, whitening results last between 1 to 3 years. This depends on your lifestyle (smoking, coffee, red wine intake) and whether you use take-home trays for occasional touch-ups."
        },
        {
          q: "Will whitening work on fillings or crowns?",
          a: "No. Teeth whitening gels only work on natural tooth structures. Any composite fillings, crowns, veneers, or bridges will retain their original color. We can discuss replacement options if needed."
        }
      ]}
      beforeImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=500"
      afterImage="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=500"
      durationMins={60}
      priceFrom={250}
    />
  );
}
