"use client";

import React from "react";
import BookButton from "./BookButton";
import { CLINIC } from "@/lib/constants";
import { Sparkles, PhoneCall, CalendarRange } from "lucide-react";

interface PremiumBookingCTAProps {
  title?: string;
  description?: string;
  primaryBtnLabel?: string;
  secondaryBtnLabel?: string;
  serviceSlug?: string;
}

export default function PremiumBookingCTA({
  title = "Ready to Smile with Confidence?",
  description = "Book a cosmetic dental consultation or secure an examination slot with Dr. Roghay Alizadeh today. Experience Cork's luxury dental experience.",
  primaryBtnLabel = "Book Appointment Online",
  secondaryBtnLabel = "Call Clinic",
  serviceSlug,
}: PremiumBookingCTAProps) {
  return (
    <div className="relative bg-gradient-to-br from-navy via-[#0A1828] to-[#030914] text-white rounded-3xl p-10 md:p-16 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden group w-full">
      {/* Modern radial glow effects */}
      <div className="absolute -left-1/4 -top-1/2 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-gold/15 transition-all duration-700" />
      <div className="absolute -right-1/4 -bottom-1/2 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-gold/15 transition-all duration-700" />
      
      {/* Subtle top light overlay */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
        {/* Sparkle Header Icon */}
        <div className="inline-flex items-center gap-1.5 bg-gold/10 text-gold border border-gold/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full select-none">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Cork's Luxury Dental Care</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold font-serif leading-tight tracking-tight text-white drop-shadow-md">
          {title}
        </h2>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <BookButton
            serviceSlug={serviceSlug}
            label={primaryBtnLabel}
            className="w-full sm:w-auto bg-gradient-to-r from-gold to-[#D6B47C] hover:from-gold-dark hover:to-gold text-navy font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          />
          
          <a
            href={CLINIC.phoneHref}
            className="w-full sm:w-auto border border-white/15 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 text-gold shrink-0" />
            <span className="whitespace-nowrap">
              {secondaryBtnLabel}: {CLINIC.phone}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
