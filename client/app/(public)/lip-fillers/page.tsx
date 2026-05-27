import type { Metadata } from "next";
import TreatmentPageTemplate from "@/components/public/TreatmentPageTemplate";

export const metadata: Metadata = {
  title: "Lip Fillers Cork | Premium Dermal Fillers | Hollyhill Aesthetic Clinic",
  description: "Enhance lip volume, shape, and symmetry with premium hyaluronic acid dermal fillers in Cork. Experienced cosmetic care under Dr. Roghay Alizadeh. Book your consult.",
  keywords: ["lip fillers Cork", "dermal fillers Cork", "lip enhancement Cork", "hyaluronic acid fillers", "lip volume Cork"],
};

export default function LipFillersPage() {
  return (
    <TreatmentPageTemplate
      slug="lip-fillers"
      treatmentName="Lip Fillers"
      heroTitle="Beautifully defined, natural-looking lips"
      heroSubtitle="Add volume, refine shape, and restore hydration with premium hyaluronic acid dermal fillers in Cork."
      heroImage="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600"
      descriptionText={`Lip Fillers are popular cosmetic treatments designed to add volume, definition, and hydration to the lips. Using premium hyaluronic acid (a substance that occurs naturally in the body), we can sculpt the lips to improve symmetry, smooth out vertical lip lines, and create a fuller yet completely natural appearance.

Dr. Roghay Alizadeh specializes in the 'natural lip border enhancement' technique. Rather than overfilling, we focus on balancing proportions and adding structure, ensuring your lips remain soft, hydrated, and proportional to your facial features.`}
      benefits={[
        "Restores natural volume and structure to thin lips.",
        "Improves lip symmetry and defines the lip borders (Cupid's bow).",
        "Hydrates lips from within, smoothing out fine vertical lines.",
        "Instant results that continue to settle beautifully.",
        "Reversible treatment using premium hyaluronic acid."
      ]}
      procedureSteps={[
        {
          title: "Symmetry Assessment",
          description: "We analyze your lip proportions, discuss your shape goals, and select the optimal filler density."
        },
        {
          title: "Numbing Preparation",
          description: "A strong topical anesthetic is applied to the lips to minimize sensitivity during injections."
        },
        {
          title: "Artistic Sculpting",
          description: "Hyaluronic acid filler is precisely injected using micro-cannulas or fine needles to sculpt and volume."
        }
      ]}
      recoveryTime="Mild swelling, redness, and minor bruising are common for 24-48 hours. Avoid touching the area, drinking hot liquids, using straws, or intense exercise for 24 hours. The filler fully integrates and settles within 1-2 weeks."
      faqs={[
        {
          q: "How long do lip fillers last?",
          a: "Most hyaluronic acid lip fillers last between 6 to 12 months. The longevity depends on your metabolism, lifestyle, and the specific filler product used."
        },
        {
          q: "Are dermal fillers safe?",
          a: "Yes, when performed by a qualified, experienced medical professional. We only use premium, CE-marked, FDA-approved hyaluronic acid fillers which are fully reversible."
        },
        {
          q: "Will my lips feel hard or unnatural?",
          a: "Not at all. We use advanced injection techniques and highly flexible fillers designed specifically for the lips, ensuring they feel soft, natural, and move normally when smiling or talking."
        }
      ]}
      beforeImage="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=500"
      afterImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=500"
      durationMins={30}
      priceFrom={250}
    />
  );
}
