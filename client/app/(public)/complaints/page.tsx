"use client";

import { useState } from "react";
import { CLINIC } from "@/lib/constants";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export default function ComplaintsPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const steps = [
    { title: "1. Submission", desc: "Submit your details using our clinic feedback form below." },
    { title: "2. Acknowledgment", desc: "Our clinic lead acknowledges your feedback within 2 working days." },
    { title: "3. Clinical Audit", desc: "Dr. Roghay Alizadeh audits the treatment file records internally." },
    { title: "4. Full Resolution", desc: "We contact you with a detailed clinical report and resolution within 14 days." },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Interior Hero */}
      <section className="bg-navy text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/10 opacity-40" />
        <div className="relative z-10 space-y-3">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Feedback & Complaints</h1>
          <p className="text-gray-300 text-xs md:text-sm tracking-wide uppercase">
            Our commitment to clinical quality, transparency, and resolution
          </p>
        </div>
      </section>

      {/* Resolution timeline */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <h3 className="text-xl font-serif font-bold text-navy text-center">Our Resolution Process</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="border border-gray-100 p-5 rounded-xl bg-white shadow-sm space-y-2">
              <h4 className="font-serif text-xs font-bold text-navy">{s.title}</h4>
              <p className="text-gray-500 text-[10px] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dental Council escalation card */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="border border-amber-200 rounded-xl p-6 bg-amber-50/20 flex gap-4 items-start">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-2 text-navy">
            <h4 className="font-serif font-bold">External Clinical Escalation</h4>
            <p className="text-gray-600 leading-relaxed">
              If our internal clinical audit and proposed resolution do not satisfy your concerns, you have the right to escalate your query to the **Irish Dental Council** (57 Merrion Square, Dublin 2) or contact the **Dental Complaints Resolution Service** (DCRS) directly.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback form */}
      <section className="max-w-xl mx-auto px-4 space-y-6">
        <h3 className="text-xl font-serif font-bold text-navy text-center">Feedback Form</h3>
        
        {formSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-xs text-emerald-800 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold">Feedback Lodged</h4>
            <p>Our lead coordinator has flagged this request and will contact you within 48 hours.</p>
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
                <label className="text-[10px] font-semibold text-navy">Phone *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-navy">Email *</label>
              <input
                type="email"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-navy">Date of Treatment</label>
              <input
                type="date"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-navy">Description of Concern *</label>
              <textarea
                rows={4}
                required
                placeholder="Please describe your experience or treatment concern in detail..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-2.5 rounded-lg text-xs shadow-md transition-colors"
            >
              Submit Clinical Feedback
            </button>
          </form>
        )}
      </section>

    </div>
  );
}
