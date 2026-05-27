import type { Metadata } from "next";
import TreatmentPageTemplate from "@/components/public/TreatmentPageTemplate";

export const metadata: Metadata = {
  title: "HydraFacial Treatment Cork | Skin Rejuvenation | Hollyhill Aesthetic Clinic",
  description: "Experience deep skin cleansing, exfoliation, and hydration with HydraFacial in Cork. Unveil a clear, radiant complexion under Dr. Roghay Alizadeh. Book your treatment.",
  keywords: ["HydraFacial Cork", "skin cleaning Cork", "facial treatments Cork", "skin hydration Cork", "pore extraction Cork"],
};

export default function HydraFacialPage() {
  return (
    <TreatmentPageTemplate
      slug="hydrafacial"
      treatmentName="HydraFacial Treatment"
      heroTitle="Instant, long-lasting skin glow with HydraFacial"
      heroSubtitle="Cleanse, extract, and hydrate your skin using advanced patented vortex technology for a clear, radiant glow."
      heroImage="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
      descriptionText={`A HydraFacial is a multi-step, medical-grade skin resurfacing treatment that combines cleansing, exfoliation, extraction, hydration, and antioxidant protection simultaneously. Using a patented vortex fusion delivery system, it vacuum-extracts blackheads and clogged pores while infusing premium serums loaded with hyaluronic acid, peptides, and antioxidants.

This treatment is suitable for all skin types and addresses multiple concerns including fine lines, congested pores, uneven skin texture, and hyperpigmentation, with immediate visible results.`}
      benefits={[
        "Deeply cleanses and extracts blackheads, whiteheads, and oily pores.",
        "Gently exfoliates dead skin cells, revealing smooth skin texture.",
        "Infuses intensive hydration, plumping fine lines and wrinkles.",
        "Improves skin tone, clarity, brightness, and hyperpigmentation.",
        "Non-irritating with zero downtime or redness."
      ]}
      procedureSteps={[
        {
          title: "Cleanse & Peel",
          description: "A gentle exfoliating tip cleanses the skin and applies a mild salicylic/glycolic acid peel to loosen dirt."
        },
        {
          title: "Extract & Hydrate",
          description: "Patented vortex vacuum suction extracts blackheads and debris from pores while infusing skin nourishers."
        },
        {
          title: "Fuse & Protect",
          description: "Highly customized booster serums and antioxidants are saturated into the skin to seal hydration and radiance."
        }
      ]}
      recoveryTime="No recovery time needed. You can apply makeup and resume regular activity immediately. Your skin will look instantly hydrated, plump, and glowing. We recommend daily sun protection (SPF 30+) to maintain results."
      faqs={[
        {
          q: "Who is HydraFacial suitable for?",
          a: "HydraFacial is designed for all skin types, including sensitive skin. It is excellent for treating oily skin, dry skin, congested pores, and early signs of aging."
        },
        {
          q: "How often should I get a HydraFacial?",
          a: "For optimal skin health, we recommend one HydraFacial treatment every 4 to 6 weeks. This helps maintain clean pores, smooth texture, and an active skin cell cycle."
        },
        {
          q: "Is it painful?",
          a: "Not at all. Most patients describe it as a relaxing sensation similar to a cool paintbrush moving slowly across the skin. There is no squeezing or painful extraction."
        }
      ]}
      beforeImage="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=500"
      afterImage="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=500"
      durationMins={45}
      priceFrom={120}
    />
  );
}
