"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CLINIC, SERVICES } from "@/lib/constants";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";
import { Star, ShieldCheck, Award, HeartHandshake, HelpCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import Testimonials3D from "@/components/public/Testimonials3D";
import PremiumBookingCTA from "@/components/public/PremiumBookingCTA";

export default function HomeClient() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const router = useRouter();
  const { user } = useAuthStore();
  const { openLoginModal } = useUIStore();

  const goToBooking = () => {
    const target = "/portal/booking";
    if (user) {
      router.push(target);
      return;
    }
    openLoginModal(() => {
      router.push(target);
    });
  };

  const homeServices = SERVICES.filter((s) =>
    [
      "general-dentistry",
      "dental-checkups",
      "teeth-cleaning",
      "teeth-whitening",
      "invisalign",
      "composite-bonding",
    ].includes(s.slug)
  );

  const faqs = [
    {
      q: "Do you offer same-day appointments for dental emergencies?",
      a: "Yes! We reserve dedicated emergency slots daily. If you have severe toothache, bleeding, or a broken tooth, call us immediately at +353 21 430 3072 so we can schedule you today.",
    },
    {
      q: "Can I pay for my dental treatments in instalments?",
      a: "Absolutely. We offer tailored, interest-free payment plans for major treatments like Invisalign and Porcelain Veneers. Speak to our team to arrange monthly instalments.",
    },
    {
      q: "How does the PRSI dental benefit work?",
      a: "If you qualify under PRSI, you are entitled to one free dental exam and a subsidized teeth cleaning (€15 charge instead of the standard rate) once per calendar year.",
    },
    {
      q: "Is parking available at the clinic?",
      a: "Yes, we are located in Unit 6 of the Hollyhill Shopping Centre in Cork, which offers extensive free parking directly in front of the clinic.",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="min-h-[85vh] xl:min-h-screen bg-navy text-white flex items-center relative overflow-hidden pt-12">
        {/* Subtle geometric gold mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-navy/5 to-navy opacity-80" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-12">
          {/* Left Column content */}
          <div className="lg:col-span-7 space-y-6 animate-fade-up">
            <span className="inline-block bg-gold/15 text-gold text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-gold/20">
              Premium Dental &amp; Aesthetic Care &middot; Cork, Ireland
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
              {CLINIC.tagline}
            </h1>
            <p className="text-gray-300 text-sm md:text-base xl:text-lg max-w-xl font-normal leading-relaxed">
              Experience the highest standard of skin and dental therapies. Dr. Roghay Alizadeh, principal clinician, brings over 20 years of clinical and cosmetic expertise to Cork. Discover world-class care in a warm, relaxing atmosphere.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={goToBooking}
                className="bg-gold hover:bg-gold-dark text-navy text-center py-3.5 px-8 rounded-lg font-bold text-xs tracking-wider uppercase shadow-lg transition-all cursor-pointer"
              >
                Book Appointment &rarr;
              </button>
              <Link
                href="/services"
                className="border border-white/20 hover:border-white/50 text-white text-center py-3.5 px-8 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all"
              >
                View Our Services
              </Link>
            </div>

            {/* Micro badges container */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-white/10 mt-8">
              <div>
                <span className="block text-2xl font-serif font-bold text-gold">20+</span>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Years Experience</span>
              </div>
              <div className="w-px bg-white/10 hidden sm:block" />
              <div>
                <span className="block text-2xl font-serif font-bold text-gold">5.0 ★</span>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Google Rating</span>
              </div>
              <div className="w-px bg-white/10 hidden sm:block" />
              <div>
                <span className="block text-2xl font-serif font-bold text-gold">Same-Day</span>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Emergency Slots</span>
              </div>
            </div>
          </div>

          {/* Right Column photo placeholder */}
          <div className="lg:col-span-5 relative flex justify-center order-first lg:order-none">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] xl:max-w-[380px] aspect-[4/5] bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5">
              {/* Visual cards overlay (pinned inside photo bounds) */}
              <div
                className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white text-navy p-2.5 sm:p-3.5 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-2 sm:gap-2.5 z-20 animate-bounce max-w-[80%]"
                style={{ animationDuration: "6s" }}
              >
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                <div className="text-[10px] sm:text-[11px] font-bold truncate">Next Slot: Today 2:30pm</div>
              </div>

              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-navy/90 text-white p-2.5 sm:p-3.5 rounded-xl border border-white/10 shadow-2xl flex items-center gap-2 sm:gap-2.5 z-20">
                <span className="text-gold text-xs">★★★★★</span>
                <div className="text-[10px] font-semibold">500+ Happy Patients</div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600"
                alt="Patient smiling after dental cleaning"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-bold text-gold">Clinical Solutions</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy">Our Services</h2>
          <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            From essential examinations to state-of-the-art cosmetic makeovers, skin rejuvenation, and Botox treatments under one luxury roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeServices.map((s) => (
            <div
              key={s.slug}
              className="border border-gray-100 hover:border-gold hover:shadow-gold-hover hover:-translate-y-1 bg-white rounded-2xl p-6 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-5 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-navy mb-2">{s.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">{s.description}</p>
              </div>
              <div className="border-t border-gray-50 pt-4 flex items-center justify-between mt-auto">
                <span className="text-navy font-bold text-xs">From &euro;{s.priceFrom}</span>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-xs font-semibold text-gold hover:text-gold-dark flex items-center gap-1"
                >
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ABOUT CLINIC */}
      <section className="bg-off-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[360px] aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
              <img
                src="/doctor.png"
                alt="Dr. Roghay Alizadeh cosmetic dentist Cork"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Bio */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] uppercase tracking-widest font-bold text-gold">Meet the Principal Dentist</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">{CLINIC.doctor}</h2>
            <div className="inline-block bg-gold/15 text-gold text-xs font-semibold px-3.5 py-1 rounded-full border border-gold/10">
              {CLINIC.doctorTitle}
            </div>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Dr. Roghay Alizadeh has dedicated her career to providing advanced cosmetic treatments, smiles reconstruction, and nervous patient therapy. Graduating from top international universities and maintaining active membership in the Irish Dental Association (IDA), Dr. Roghay combines meticulous clinical excellence with a gentle, patient-centered touch.
            </p>
            
            {/* Qualification list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-navy">
                <Award className="w-4 h-4 text-gold" />
                <span>Dental Council Registered (#4203)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-navy">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>IDA Member in Good Standing</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-navy">
                <HeartHandshake className="w-4 h-4 text-gold" />
                <span>Advanced Cosmetic Training Certified</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-navy">
                <HelpCircle className="w-4 h-4 text-gold" />
                <span>Nervous Patient Sedation Specialist</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="bg-navy hover:bg-gray-800 text-white py-3 px-8 rounded-lg font-bold text-xs tracking-wider uppercase shadow-md transition-all inline-block"
              >
                Read Full Bio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BEFORE & AFTER PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-bold text-gold">Smile Transformations</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy">Real Results, Real Patients</h2>
          <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Drag the slider arrows below to compare before and after clinical photographs of actual smile reconstructions completed by Dr. Roghay Alizadeh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BeforeAfterSlider
            treatmentName="Porcelain Veneers"
            initials="A.C."
            beforeImage="/image_copy.png"
            afterImage="/image_copy.png"
          />
          <BeforeAfterSlider
            treatmentName="Composite Bonding"
            initials="M.H."
            beforeImage="/image.png"
            afterImage="/image.png"
          />
          <BeforeAfterSlider
            treatmentName="Invisalign Clear Aligners"
            initials="L.D."
            beforeImage="/image_copy_2.png"
            afterImage="/image_copy_2.png"
          />
        </div>
      </section>

      {/* 5. TESTIMONIALS CAROUSEL */}
      <section className="bg-navy text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-widest font-bold text-gold">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-white">What Our Patients Say</h2>
            <p className="text-gray-400 text-xs max-w-lg mx-auto">
              Swipe or drag to explore verified clinical success stories from our wonderful patients in Cork.
            </p>
          </div>
          
          <Testimonials3D />
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-navy">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-xs">Got questions? We have answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;

            return (
              <div
                key={index}
                className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <div
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors select-none"
                >
                  <span className="text-xs md:text-sm font-bold text-navy leading-snug">{faq.q}</span>
                  <span className="text-gold font-bold text-lg">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div className="p-5 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 leading-relaxed animate-fade-up">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <PremiumBookingCTA />
      </section>

    </div>
  );
}
