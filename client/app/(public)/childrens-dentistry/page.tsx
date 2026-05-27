import { CLINIC } from "@/lib/constants";
import { Smile, Award, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";
import BookButton from "@/components/public/BookButton";

export default function ChildrensDentistryPage() {
  const ageGuides = [
    { title: "Babies (0-2)", desc: "Gentle checking of first tooth eruption and dietary counseling tips." },
    { title: "Toddlers (2-5)", desc: "Familiarization visits to establish brushing routines without fear." },
    { title: "Children (5-12)", desc: "Fissure sealants and orthodontic alignment development checking." },
    { title: "Teens (12-18)", desc: "Teeth alignment audits, sports mouthguards, and hygiene education." },
  ];

  const parentTips = [
    "Start brushing as soon as the first baby tooth erupts.",
    "Make brushing fun by using themed toothbrushes or music apps.",
    "Bring your child to the clinic early so they adapt to the sound of dental devices.",
    "Limit sugary drinks, cordials, and bedtime treats.",
    "Ensure they wear customized mouthguards during sports matches.",
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Friendly Hero */}
      <section className="bg-gradient-to-r from-sky-950 to-navy text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/10 opacity-30" />
        <div className="relative z-10 space-y-4 max-w-xl mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Children's Dentistry</h1>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            Building positive habits for a lifetime of healthy smiles. Friendly pediatric care under Dr. Roghay Alizadeh.
          </p>
        </div>
      </section>

      {/* Age Guide */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <h3 className="text-xl font-serif font-bold text-navy text-center">Smiles By Age Group</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ageGuides.map((g, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-5 bg-white text-center space-y-2 shadow-sm hover:border-gold transition-colors">
              <h4 className="font-serif text-sm font-bold text-navy">{g.title}</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Treatment pricing table */}
      <section className="max-w-3xl mx-auto px-4 space-y-6">
        <h3 className="text-xl font-serif font-bold text-navy text-center">Pediatric Dental Pricing</h3>
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-navy text-white">
              <tr>
                <th className="p-4">Procedure</th>
                <th className="p-4 text-right">Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-4">Child Dental Examination (under 12)</td>
                <td className="p-4 text-right text-gold font-bold">&euro;40.00</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4">Fissure Sealant (per tooth protection)</td>
                <td className="p-4 text-right text-gold font-bold">&euro;30.00</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4">Child Scale & Polish cleaning</td>
                <td className="p-4 text-right text-gold font-bold">&euro;45.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Parent tips checklist */}
      <section className="max-w-xl mx-auto px-4 space-y-6">
        <h3 className="text-xl font-serif font-bold text-navy text-center">Tips For Parents</h3>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 space-y-3.5">
          {parentTips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
              <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-navy text-white rounded-2xl p-10 text-center space-y-4">
          <h3 className="text-2xl font-serif font-semibold">Book a Friendly Checkup</h3>
          <p className="text-gray-300 text-xs">
            Schedule an examination slot or call our Hollyhill dental surgery.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <BookButton
              label="Book Online"
              className="bg-gold hover:bg-gold-dark text-navy font-bold text-xs px-6 py-3 rounded-lg shadow cursor-pointer"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
