"use client";

import { useState } from "react";
import { CLINIC } from "@/lib/constants";
import { Gift, CheckCircle2, Award, Users } from "lucide-react";

export default function ReferralPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Interior Hero */}
      <section className="bg-navy text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/10 opacity-40" />
        <div className="relative z-10 space-y-3">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Patient Referral Scheme</h1>
          <p className="text-gray-300 text-xs md:text-sm tracking-wide uppercase">
            Share the joy of a confident smile and claim rewards
          </p>
        </div>
      </section>

      {/* 3 Step visual process */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <h3 className="text-xl font-serif font-bold text-navy text-center">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-100 p-5 rounded-xl bg-white shadow-sm text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-sm font-bold text-navy">1. Refer a Friend</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Fill in their contact details in our simple referral checklist form below.
            </p>
          </div>
          <div className="border border-gray-100 p-5 rounded-xl bg-white shadow-sm text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-sm font-bold text-navy">2. Friend Attends Visit</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Your friend schedules and completes their diagnostic checkup examination.
            </p>
          </div>
          <div className="border border-gray-100 p-5 rounded-xl bg-white shadow-sm text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-sm font-bold text-navy">3. Claim &euro;20 Credit</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              We apply a &euro;20 discount credit to both of your patient accounts instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Referral form */}
      <section className="max-w-xl mx-auto px-4">
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-xs text-emerald-800 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold">Referral Logged!</h4>
            <p>Thank you. We will send an email invitation to your friend detailing how to book.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 shadow-card rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-navy border-b border-gray-100 pb-3">Referral Form</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Your Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Friend's Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Friend's Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-2.5 rounded-lg text-xs shadow-md transition-colors"
            >
              Submit Referral Invitation
            </button>
          </form>
        )}
      </section>

    </div>
  );
}
