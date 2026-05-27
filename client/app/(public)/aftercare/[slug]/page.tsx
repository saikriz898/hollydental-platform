import { CLINIC } from "@/lib/constants";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertOctagon, Heart, CheckCircle } from "lucide-react";

// For static parameters generation
export async function generateStaticParams() {
  return [
    { slug: "tooth-extraction" },
    { slug: "root-canal" },
    { slug: "teeth-whitening" },
    { slug: "composite-bonding" },
    { slug: "veneers" },
    { slug: "invisalign" },
  ];
}

interface AftercareData {
  title: string;
  firstHours: string[];
  painTips: string;
  avoidFoods: string[];
  allowFoods: string[];
  warnings: string[];
  timeline: string[];
}

const AFTERCARE_TEMPLATES: Record<string, AftercareData> = {
  "tooth-extraction": {
    title: "Tooth Extraction Aftercare",
    firstHours: [
      "Bite firmly on the gauze pad for 30-45 minutes to encourage clotting.",
      "Do not rinse, spit, or drink through a straw for the first 24 hours.",
      "Apply an ice pack to the cheek for 10 minutes at a time to check swelling.",
    ],
    painTips: "Take over-the-counter pain relief (e.g. Ibuprofen) before the anesthetic wear-off. Avoid Aspirin as it can thin the blood.",
    avoidFoods: ["Hot soups or coffee", "Crunchy crisps or seeds", "Spicy food irritation"],
    allowFoods: ["Cool yogurt", "Mashed potatoes", "Smooth ice-cream"],
    warnings: [
      "Bleeding that continues actively after 24 hours.",
      "Severe throbbing pain that pain relievers do not soothe (Dry Socket warning).",
      "Swelling or fever that increases after 3 days.",
    ],
    timeline: ["Day 1: Rest and blood clot safety", "Week 1: Soft tissue healing", "Month 1: Socket filling", "6 Months: Bone reconstruction"],
  },
  "root-canal": {
    title: "Root Canal Aftercare",
    firstHours: [
      "Avoid eating until the local numbness has completely worn off to prevent lip-biting.",
      "Do not chew or bite down directly on the treated tooth until it is crowned.",
    ],
    painTips: "The tooth may feel sensitive for 2-3 days due to tissue inflammation. Standard anti-inflammatories work efficiently.",
    avoidFoods: ["Hard nuts or sweets", "Sticky chewing gum", "Extremely cold ice water"],
    allowFoods: ["Warm oatmeal", "Soft scrambled eggs", "Mashed bananas"],
    warnings: [
      "Temporary filling falls out completely.",
      "Severe swelling visible on the gum line.",
      "Uneven bite feeling causing pain.",
    ],
    timeline: ["Day 1: Local sensitivity", "Week 1: Crown preparation", "Month 1: Permanent crown fitted", "6 Months: Full restoration check"],
  },
  "teeth-whitening": {
    title: "Teeth Whitening Aftercare",
    firstHours: [
      "Adhere strictly to the 'White Diet' for the first 48 hours.",
      "Avoid dark-colored beverages or tobacco products entirely.",
    ],
    painTips: "Use toothpaste designed for sensitive teeth if you experience minor transient temperature zings.",
    avoidFoods: ["Black coffee or tea", "Red wine or dark beers", "Bolognese pasta sauces"],
    allowFoods: ["White rice and pasta", "Chicken breast", "Milk and white cheese"],
    warnings: [
      "Severe, persistent shooting pain in gums.",
      "Chemical burn spots visible on gum margins.",
    ],
    timeline: ["Day 1: Enamel hydration", "Week 1: Bright color settling", "Month 1: Color lock", "6 Months: Touch-up audit"],
  },
  "composite-bonding": {
    title: "Composite Bonding Aftercare",
    firstHours: [
      "Avoid staining beverages for the first 48 hours.",
      "Do not use bonded teeth to tear tape or open packets.",
    ],
    painTips: "Bonding rarely causes pain. Minor gum tenderness can arise if margins were finished deep.",
    avoidFoods: ["Hard crusty baguettes", "Biting directly into apples", "Ice cube chewing"],
    allowFoods: ["Standard soups", "Soft pasta dishes", "Steamed fish"],
    warnings: [
      "Chipped or rough texture felt on bonded edge.",
      "Sudden discoloration along composite margins.",
    ],
    timeline: ["Day 1: Resin seal safety", "Week 1: Adaptive bite checking", "Month 1: Maintenance rinse", "6 Months: Polishing check"],
  },
  "veneers": {
    title: "Veneers Aftercare",
    firstHours: [
      "Wear your nightguard if you have been diagnosed with sleep bruxism.",
      "Adhere to standard non-abrasive brushing.",
    ],
    painTips: "Temporary sensitivity is normal during initial cement setting. Warm salt water rinses soothe gums.",
    avoidFoods: ["Biting hard candies", "Chewing fingernails", "Tearing tough meats"],
    allowFoods: ["Steamed vegetables", "Oatmeals", "Rice and gravy"],
    warnings: [
      "Veneer feels loose or detaches completely.",
      "Persistent pain when chewing on veneer tooth.",
    ],
    timeline: ["Day 1: Cement lock", "Week 1: Bite integration", "Month 1: Gum adaptation check", "6 Months: Polish audit"],
  },
  "invisalign": {
    title: "Invisalign Aftercare & Rules",
    firstHours: [
      "Wear aligners for 20-22 hours daily. Only remove them to eat, drink, or brush.",
      "Rinse aligners with cold water before snapping them back in.",
    ],
    painTips: "Mild pressure is normal for the first 24 hours of each new aligner tray. This indicates the teeth are moving.",
    avoidFoods: ["Eating with aligners in", "Drinking hot tea or coffee", "Chewing sticky sweets"],
    allowFoods: ["Any foods (remove aligners first)", "Plain water (while wearing aligners)"],
    warnings: [
      "Aligner tray cracks or breaks.",
      "Severe bleeding of gums around attachment buttons.",
    ],
    timeline: ["Week 1: Tray adaptation", "Month 1: Attachment audit", "6 Months: Progress assessment", "12 Months: Retention design"],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AftercareDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = AFTERCARE_TEMPLATES[slug];

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-16 pb-16">
      
      {/* Interior Hero */}
      <section className="bg-navy text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/10 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-4">
          <Link href="/services" className="inline-flex items-center gap-1 text-xs text-gold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Return to Services
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">{data.title}</h1>
          <p className="text-gray-300 text-xs md:text-sm">Follow these recovery rules to maximize clinical treatment success</p>
        </div>
      </section>

      {/* Steps and Pain management */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Hours */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-navy">First 24 &ndash; 48 Hours Guidelines</h3>
            <div className="space-y-3">
              {data.firstHours.map((step, idx) => (
                <div key={idx} className="flex gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl items-start">
                  <span className="w-6 h-6 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-gray-600 text-xs leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pain Management */}
          <div className="border-l-4 border-gold bg-gold/5 p-5 rounded-r-xl space-y-2">
            <h4 className="text-xs font-bold text-navy">Comfort & Pain Management</h4>
            <p className="text-gray-600 text-xs leading-relaxed">{data.painTips}</p>
          </div>
        </div>

        {/* Right Food grid */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-lg font-serif font-bold text-navy">Dietary Rules</h3>
          
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 text-center text-xs font-bold">
              <div className="bg-red-50 text-red-600 p-3 border-r border-gray-100">Avoid (Red List)</div>
              <div className="bg-emerald-50 text-emerald-600 p-3">Allow (Green List)</div>
            </div>
            <div className="grid grid-cols-2 text-xs text-gray-500 min-h-[120px]">
              <div className="p-4 border-r border-gray-100 space-y-2 bg-red-50/10">
                {data.avoidFoods.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-red-500">&times;</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-emerald-50/10 space-y-2">
                {data.allowFoods.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-emerald-500">&#10003;</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warning signs & emergency call */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="border border-red-200 rounded-2xl p-6 bg-red-50/30 space-y-4">
          <div className="flex items-center gap-2.5 text-red-600">
            <AlertOctagon className="w-5 h-5" />
            <h4 className="font-serif text-sm font-bold">Warning Signs &mdash; Call us immediately if:</h4>
          </div>
          <ul className="space-y-2 text-xs text-gray-600 pl-4 list-disc">
            {data.warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
          
          <div className="pt-2">
            <a
              href={CLINIC.phoneHref}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-6 rounded-lg inline-flex items-center gap-2 shadow"
            >
              <PhoneCallIcon /> {CLINIC.phone} &mdash; Emergency Support
            </a>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        <h3 className="text-lg font-serif font-bold text-navy text-center">Healing Timeline</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.timeline.map((step, idx) => (
            <div key={idx} className="border border-gray-100 bg-white rounded-xl p-4 shadow-sm text-center">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-1">Phase {idx+1}</span>
              <p className="text-xs font-bold text-navy">{step}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

function PhoneCallIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
