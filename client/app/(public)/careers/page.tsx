"use client";

import { useState } from "react";
import { CLINIC } from "@/lib/constants";
import { Briefcase, CheckCircle2, GraduationCap, Star } from "lucide-react";

export default function CareersPage() {
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
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Careers at Hollyhill</h1>
          <p className="text-gray-300 text-xs md:text-sm tracking-wide uppercase">
            Join Cork's leading advanced cosmetic dental team
          </p>
        </div>
      </section>

      {/* Culture cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-gray-100 p-5 rounded-xl bg-white text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-sm font-bold text-navy">Continuous Learning</h4>
          <p className="text-gray-500 text-xs leading-relaxed">
            We sponsor training programs for dental assistants, hygienists, and specialists.
          </p>
        </div>
        <div className="border border-gray-100 p-5 rounded-xl bg-white text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
            <Star className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-sm font-bold text-navy">Luxury Facilities</h4>
          <p className="text-gray-500 text-xs leading-relaxed">
            Operate in clean, beautiful surgeries equipped with advanced rotary and digital systems.
          </p>
        </div>
        <div className="border border-gray-100 p-5 rounded-xl bg-white text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
            <Briefcase className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-sm font-bold text-navy">Work-Life Balance</h4>
          <p className="text-gray-500 text-xs leading-relaxed">
            Structured hours, Sunday closures, and comprehensive pension frameworks.
          </p>
        </div>
      </section>

      {/* Vacancies / Form */}
      <section className="max-w-xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-serif font-bold text-navy">Speculative Application</h3>
          <p className="text-gray-500 text-xs">
            We are always looking for talented clinicians and dental assistants. Send us your CV.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-xs text-emerald-800 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold">Application Received</h4>
            <p>Thank you. We will review your credentials and contact you if an matching role opens.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 shadow-card rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Name *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Phone *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Role Category *</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none">
                  <option>Dental Hygienist</option>
                  <option>Dental Assistant</option>
                  <option>Dentist / Specialist</option>
                  <option>Reception & Admin</option>
                </select>
              </div>
            </div>

            {/* CV Upload Mock */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-navy block">Upload CV (PDF format, max 5MB)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gold transition-colors bg-gray-50">
                <span className="text-[10px] text-gray-400">Click to browse or drop file here</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-navy">Cover Note</label>
              <textarea
                rows={3}
                placeholder="Tell us why you would be a great fit for Dr. Roghay's clinical team..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-2.5 rounded-lg text-xs shadow-md transition-colors"
            >
              Submit Application
            </button>
          </form>
        )}
      </section>

    </div>
  );
}
