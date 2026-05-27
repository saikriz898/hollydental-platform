"use client";

import { useState } from "react";
import { CLINIC } from "@/lib/constants";
import { Phone, AlertCircle, ShieldCheck, CheckSquare } from "lucide-react";

export default function EmergencyPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const symptoms = [
    "Severe Throbbing Toothache",
    "Knocked-Out Tooth (Avulsion)",
    "Dental Abscess or Face Swelling",
    "Bleeding After Extractions",
    "Broken, Fractured, or Chipped Tooth",
    "Loose Crowns, Bridges, or Veneers",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Red Tinted Hero */}
      <section className="bg-gradient-to-br from-red-950 via-navy to-navy text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-600/10 opacity-40" />
        <div className="relative z-10 space-y-5 max-w-2xl mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <Phone className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">Dental Emergency in Cork?</h1>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            If you are in pain, we are here to help. We prioritize emergency patients with same-day relief slots.
          </p>
          <a
            href={CLINIC.phoneHref}
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-lg text-xs md:text-sm shadow-xl tracking-wider uppercase"
          >
            {CLINIC.phone} — Call Now
          </a>
        </div>
      </section>

      {/* Symptom Checklist */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <h3 className="text-xl font-serif font-bold text-navy text-center">Is This An Emergency?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {symptoms.map((s, i) => (
            <div key={i} className="flex items-center gap-3 bg-red-50/50 border border-red-100 rounded-xl p-4">
              <CheckSquare className="w-5 h-5 text-red-600 shrink-0" />
              <span className="text-xs font-semibold text-navy">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Step Guide */}
      <section className="bg-off-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <h3 className="text-xl font-serif font-bold text-navy text-center">What To Do Right Now</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-gold font-bold text-base block">1. Call Us Immediately</span>
              <p className="text-gray-500 text-xs leading-relaxed">
                Calling us is the fastest route to a same-day appointment. We can prepare tools and slot you in.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-gold font-bold text-base block">2. Manage Symptoms</span>
              <p className="text-gray-500 text-xs leading-relaxed">
                Rinse with warm salt water. For swelling, apply a cold compress to the cheek. Take standard over-the-counter pain relief.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
              <span className="text-gold font-bold text-base block">3. Keep Dental Fragments</span>
              <p className="text-gray-500 text-xs leading-relaxed">
                If a tooth is knocked out, place it in milk or back in the socket if possible, and bring it to our clinic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Same-day Guarantee Strip */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-navy text-white rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-gold shrink-0" />
            <div>
              <h4 className="font-serif text-sm font-bold">Same-Day Relief Guarantee</h4>
              <p className="text-gray-400 text-[10px]">We guarantee to slot in emergency cases on the day they call during surgery hours.</p>
            </div>
          </div>
          <a href={CLINIC.phoneHref} className="text-gold font-bold hover:underline text-xs shrink-0">
            Call Clinic &rarr;
          </a>
        </div>
      </section>

      {/* Emergency Fast Form */}
      <section className="max-w-xl mx-auto px-4 space-y-6">
        <h3 className="text-xl font-serif font-bold text-navy text-center">Request Urgent Call-Back</h3>
        
        {formSubmitted ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-xs text-red-800 space-y-2">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <h4 className="font-bold">Emergency Request Received</h4>
            <p>Our receptionist is prioritizing your request and will phone you immediately.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 shadow-card rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Name *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Phone *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-navy">Describe the Pain / Incident *</label>
              <textarea
                rows={3}
                required
                placeholder="Where is the pain? Is there swelling or bleeding? Let us know..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg text-xs shadow-md transition-colors uppercase tracking-wider"
            >
              Request Emergency Call-Back
            </button>
          </form>
        )}
      </section>

    </div>
  );
}
