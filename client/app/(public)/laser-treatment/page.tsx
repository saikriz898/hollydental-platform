import type { Metadata } from "next";
import TreatmentPageTemplate from "@/components/public/TreatmentPageTemplate";

export const metadata: Metadata = {
  title: "Laser Skin Treatment Cork | Advanced Laser Clinic | Hollyhill Aesthetic Clinic",
  description: "Rejuvenate your skin, reduce wrinkles, and target hyperpigmentation with advanced laser skin treatment in Cork. Safe and clinically proven laser procedures.",
  keywords: ["laser skin treatment Cork", "laser facial Cork", "fractional laser Cork", "laser skin resurfacing", "pigmentation laser Cork"],
};

export default function LaserTreatmentPage() {
  return (
    <TreatmentPageTemplate
      slug="laser-treatment"
      treatmentName="Laser Skin Treatment"
      heroTitle="Advanced laser resurfacing for flawless, clear skin"
      heroSubtitle="Soften deep lines, stimulate skin collagen, and fade sun damage with medical-grade laser skin treatments in Cork."
      heroImage="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600"
      descriptionText={`Laser Skin Treatment (Laser Resurfacing) is a state-of-the-art procedure that uses targeted beams of light energy to treat skin concerns. We offer both ablative and non-ablative fractional laser options. The laser penetrates the skin layers to vaporize damaged cells and stimulate the deep dermis to produce new, healthy collagen.

This advanced laser technology is highly effective at reducing deep-set wrinkles, acne scars, age spots, uneven skin tone, and broken capillaries, giving you a smooth and youthful appearance.`}
      benefits={[
        "Significantly reduces deep wrinkles, fine lines, and crow's feet.",
        "Targets and fades dark sun spots, age spots, and freckles.",
        "Smooths out rough skin texture and shrinks enlarged pores.",
        "Triggers long-term collagen remodeling for firmer skin.",
        "Highly precise and customizable treatment depths."
      ]}
      procedureSteps={[
        {
          title: "Laser Consultation",
          description: "We analyze your skin type, discuss your concerns, check for contraindications, and adjust laser power parameters."
        },
        {
          title: "Numbing & Protection",
          description: "A topical numbing cream is applied for comfort, and we provide protective goggles to shield your eyes."
        },
        {
          title: "Laser Delivery",
          description: "The laser handpiece is guided across the skin, releasing micro-beams of light energy into the tissue layers."
        }
      ]}
      recoveryTime="Skin will look flushed and feel tight for 3 to 7 days. Mild swelling and peeling are normal as skin heals. Apply a soothing recovery balm, avoid scratching or picking, and stay out of direct sunlight. Sun protection (SPF 50) is mandatory."
      faqs={[
        {
          q: "What does laser skin treatment feel like?",
          a: "Most patients describe the sensation as a warm, snapping feeling, like a rubber band flicking against the skin. The numbing cream and cooling air systems make the procedure very tolerable."
        },
        {
          q: "How many laser sessions are needed?",
          a: "Depending on the concern, 1 to 3 sessions are recommended for fractional skin resurfacing. Pigmentation and broken capillaries often see great improvement after just one session."
        },
        {
          q: "Are there side effects?",
          a: "Redness, swelling, and dryness are expected post-treatment. Rare risks like hyperpigmentation will be discussed and are minimized by strictly following our post-care instructions."
        }
      ]}
      beforeImage="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=500"
      afterImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=500"
      durationMins={45}
      priceFrom={300}
    />
  );
}
