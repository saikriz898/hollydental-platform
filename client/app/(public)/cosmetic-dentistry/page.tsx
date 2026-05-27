import type { Metadata } from "next";
import TreatmentPageTemplate from "@/components/public/TreatmentPageTemplate";

export const metadata: Metadata = {
  title: "Cosmetic Dentistry Cork | Smile Makeovers & Veneers | Hollyhill Aesthetic Clinic",
  description: "Enhance your smile with premium cosmetic dentistry in Cork. Specializing in veneers, composite bonding, and clear aligners under Dr. Roghay Alizadeh.",
  keywords: ["cosmetic dentistry Cork", "smile makeover Cork", "veneers Cork", "composite bonding Cork", "aesthetic dentist Cork"],
};

export default function CosmeticDentistryPage() {
  return (
    <TreatmentPageTemplate
      slug="cosmetic-dentistry"
      treatmentName="Cosmetic Dentistry"
      heroTitle="Design your dream smile with cosmetic makeovers"
      heroSubtitle="Transform chipped, stained, or misaligned teeth into a symmetrical, brilliant smile with advanced cosmetic dentistry in Cork."
      heroImage="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600"
      descriptionText={`Cosmetic Dentistry combines clinical science and artistic skill to enhance the appearance of your teeth and gums. Whether you have chipped teeth, gaps, severe discoloration, or crowding, a tailored cosmetic treatment can restructure your smile to look balanced, healthy, and stunning.

Under Dr. Roghay Alizadeh's experienced care, we plan complete smile makeovers utilizing premium Porcelain Veneers, non-invasive Composite Bonding, and Invisalign clear aligners. We focus on matching teeth color, shape, and alignment to your natural facial contours for a premium, harmonious look.`}
      benefits={[
        "Fixes chipped, worn, cracked, or misshapen teeth.",
        "Closes gaps and aligns teeth without traditional braces.",
        "Permanently brightens severely stained or yellowed teeth.",
        "Boosts self-esteem and facial aesthetic harmony.",
        "Uses ultra-durable, natural-looking porcelain and composite."
      ]}
      procedureSteps={[
        {
          title: "Smile Design & Photography",
          description: "We capture high-resolution photos and digital scans of your teeth to simulate your new smile and plan structure."
        },
        {
          title: "Preparation & Mockup",
          description: "We lightly prepare your teeth (if choosing veneers) and apply a trial mockup so you can preview the shape."
        },
        {
          title: "Restoration Placement",
          description: "The custom porcelain veneers are permanently bonded or premium composite is sculpted and polished."
        }
      ]}
      recoveryTime="No downtime for composite bonding. Porcelain veneers may require 1-2 days to adjust to the new bite. Avoid biting directly into hard objects (apples, ice) with front teeth. Maintain daily flossing and professional cleanings."
      faqs={[
        {
          q: "What is the difference between veneers and bonding?",
          a: "Porcelain veneers are thin shells crafted in a laboratory that cover the front of the teeth. They are extremely durable and stain-resistant. Composite bonding uses a tooth-colored resin sculpted directly onto the tooth, which is quicker and require little to no tooth preparation."
        },
        {
          q: "How long do porcelain veneers last?",
          a: "With good oral hygiene and regular dental checkups, premium porcelain veneers typically last between 10 to 15 years, making them a highly durable long-term investment."
        },
        {
          q: "Are cosmetic treatments covered by insurance?",
          a: "Typically, purely cosmetic dental procedures are not covered by dental insurance or PRSI. However, we offer interest-free payment plans to help manage treatment costs."
        }
      ]}
      beforeImage="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=500"
      afterImage="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=500"
      durationMins={90}
      priceFrom={350}
    />
  );
}
