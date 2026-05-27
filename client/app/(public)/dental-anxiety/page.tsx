"use client";

import { useState } from "react";
import { CLINIC } from "@/lib/constants";
import { ShieldAlert, Compass, Volume2, MessageCircle, Heart, CheckCircle2 } from "lucide-react";

export default function DentalAnxietyPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const reassuranceCards = [
    { title: "No Rush", desc: "We schedule double-length appointments so you never feel rushed.", icon: Compass },
    { title: "Gentle Numbing", desc: "Pre-numbing gel is applied before any local anesthetic injection.", icon: Heart },
    { title: "You're In Control", desc: "We stop immediately the second you raise your hand.", icon: Volume2 },
    { title: "We Listen First", desc: "No dental work is done during your initial anxiety consultation.", icon: MessageCircle },
    { title: "Sedation Options", desc: "We offer safe oral sedation therapies for complete relaxation.", icon: ShieldAlert },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Gentle Hero */}
      <section className="bg-gradient-to-br from-indigo-950 via-navy to-navy text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/10 opacity-30" />
        <div className="relative z-10 space-y-4 max-w-xl mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">You're Safe Here.</h1>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            Overcoming dental anxiety is a journey. Dr. Roghay Alizadeh specializes in gentle, anxiety-free dentistry designed around your terms.
          </p>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-100 pb-12">
        <div className="font-serif text-5xl md:text-6xl text-gold font-bold leading-none">
          1 in 3
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-navy">Adults Experience Dental Fear</h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            If you feel nervous, you are not alone. Our clinic has been designed from the ground up to reduce sensory triggers: no chemical smell, quiet instruments, and comforting surroundings.
          </p>
        </div>
      </section>

      {/* 3. Reassurance Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <h3 className="text-xl font-serif font-bold text-navy text-center">How We Care For You</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {reassuranceCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="border border-gray-100 rounded-xl p-5 bg-white hover:border-gold transition-all text-center space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-navy">{c.title}</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Dr. Roghay Quote Block */}
      <section className="bg-off-white py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-4">
            <span className="text-4xl text-gold/30 font-serif leading-none block">&ldquo;</span>
            <p className="text-sm text-gray-600 italic leading-relaxed">
              My goal is to redefine dental visits. We start slow, we explain everything, and we never proceed unless you are completely ready. You are always in control of your treatment.
            </p>
            <span className="block text-xs font-bold text-navy">&mdash; {CLINIC.doctor}</span>
          </div>
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold shadow-md">
              <img
                src="/doctor.png"
                alt="Dr Roghay Alizadeh principal dentist Cork"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Nervous Patient Booking Form & Whatsapp */}
      <section className="max-w-xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-serif font-bold text-navy">Connect With Us Gently</h3>
          <p className="text-gray-500 text-xs">
            Submit this simple request, and we will call you for a friendly chat before scheduling anything.
          </p>
        </div>

        {formSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-xs text-emerald-800 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="font-bold">Friendly Request Received</h4>
            <p>Our team will call you within 24 hours to discuss how we can make your visit comfortable.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 shadow-card rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Phone</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-navy">Email</label>
              <input
                type="email"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-navy">Current Concerns</label>
              <textarea
                rows={3}
                placeholder="Let us know what we can do to make you feel comfortable..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-2.5 rounded-lg text-xs shadow-md transition-colors"
            >
              Request a Gentle Call-Back
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <a
            href={CLINIC.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-lg shadow"
          >
            <span>💬 Chat via WhatsApp</span>
          </a>
        </div>
      </section>

    </div>
  );
}
