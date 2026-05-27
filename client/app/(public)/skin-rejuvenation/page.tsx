import type { Metadata } from "next";
import TreatmentPageTemplate from "@/components/public/TreatmentPageTemplate";

export const metadata: Metadata = {
  title: "Skin Rejuvenation Cork | Advanced Skin Care | Hollyhill Aesthetic Clinic",
  description: "Revitalize your skin with premium rejuvenation treatments in Cork. Treat acne scars, hyperpigmentation, and aging skin with advanced procedures. Book your skin consult.",
  keywords: ["skin rejuvenation Cork", "chemical peels Cork", "acne scar treatment Cork", "anti-aging skin care", "microneedling Cork"],
};

export default function SkinRejuvenationPage() {
  return (
    <TreatmentPageTemplate
      slug="skin-rejuvenation"
      treatmentName="Skin Rejuvenation"
      heroTitle="Rebuild, refresh, and repair your skin naturally"
      heroSubtitle="Target acne scars, hyperpigmentation, fine lines, and uneven texture with medical-grade skin rejuvenation in Cork."
      heroImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600"
      descriptionText={`Skin Rejuvenation refers to a range of medical-grade treatments designed to trigger the body's natural healing response and boost collagen and elastin production. These include microneedling (dermapen), chemical peels, and custom serum infusions. 

By creating controlled micro-injuries or using specialized chemical exfoliators, these treatments accelerate skin cell turnover, fading hyperpigmentation, softening acne scars, shrinking pores, and tightening loose skin for a smoother, firmer complexion.`}
      benefits={[
        "Fades stubborn acne scars, surgical scars, and blemishes.",
        "Reduces hyperpigmentation, sun damage, and dark spots.",
        "Stimulates collagen production to smooth fine wrinkles.",
        "Shrinks enlarged pores and regulates excess sebum.",
        "Tightens skin tone and restores natural radiance."
      ]}
      procedureSteps={[
        {
          title: "Skin Analysis",
          description: "We analyze your skin condition, sensitivity, and concerns to select the optimal rejuvenation protocol."
        },
        {
          title: "Micro-Treatment",
          description: "Depending on your plan, we perform precise microneedling or apply a customized chemical peel peel."
        },
        {
          title: "Collagen Induction",
          description: "We infuse hyaluronic acid and growth factors into the deep skin layers, followed by a soothing mask."
        }
      ]}
      recoveryTime="Mild redness and heat sensation similar to a light sunburn are normal for 24-48 hours. Skin peeling or dryness may occur in days 3-5 as old skin sheds. Avoid sun exposure, saunas, makeup, and active acids (retinols) for 3-5 days. Always use SPF 50."
      faqs={[
        {
          q: "What skin concerns can skin rejuvenation treat?",
          a: "It is excellent for treating acne scars, sun damage, uneven pigmentation (melasma), fine lines, wrinkles, large pores, and general skin dullness."
        },
        {
          q: "How many sessions are recommended?",
          a: "While a single treatment will leave your skin glowing, a course of 3 to 6 sessions spaced 4 weeks apart is typically recommended for scar reduction and anti-aging benefits."
        },
        {
          q: "Is there downtime?",
          a: "Downtime is very minimal (typically 24 to 48 hours of redness). The skin heals quickly, and you can resume most normal activities on the following day."
        }
      ]}
      beforeImage="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=500"
      afterImage="https://images.unsplash.com/photo-1522337060762-f47009d3759a?auto=format&fit=crop&q=80&w=500"
      durationMins={60}
      priceFrom={150}
    />
  );
}
