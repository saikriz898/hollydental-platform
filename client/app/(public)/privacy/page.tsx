"use client";

import { useState } from "react";
import { CLINIC } from "@/lib/constants";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  const [requestSent, setRequestSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Interior Hero */}
      <section className="bg-navy text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/10 opacity-40" />
        <div className="relative z-10 space-y-3">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Privacy & Cookies Policy</h1>
          <p className="text-gray-300 text-xs md:text-sm tracking-wide uppercase">
            Your GDPR compliance rights and dental data security
          </p>
        </div>
      </section>

      {/* Main text content */}
      <section className="max-w-3xl mx-auto px-4 space-y-6 text-xs text-gray-600 leading-relaxed">
        <h3 className="font-serif text-base font-bold text-navy">1. Patient Data Security</h3>
        <p>
          At Hollyhill Dental, we take patient confidentiality seriously. We gather and store patient medical history, contact records, and diagnostic clinical files (such as X-rays and mouth scans) under the supervision of lead dentist Dr. Roghay Alizadeh. This data is handled in absolute compliance with the Irish Data Protection Acts and the European General Data Protection Regulation (GDPR).
        </p>
        <p>
          Your diagnostic folders are kept on secure cloud-backed database servers encrypted end-to-end, and are only accessible by certified clinical staff members.
        </p>

        <h3 className="font-serif text-base font-bold text-navy">2. Cookie Declaration</h3>
        <p>
          We employ cookies to facilitate patient scheduling flow, keep your portal session secure, and verify card deposits through Stripe.
        </p>
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm mt-3">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-navy text-white">
              <tr>
                <th className="p-3">Cookie Name</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Purpose</th>
                <th className="p-3">Expiry</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-semibold text-navy">__stripe_mid</td>
                <td className="p-3">Stripe</td>
                <td className="p-3">Fraud detection during booking deposits</td>
                <td className="p-3">1 year</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-semibold text-navy">token</td>
                <td className="p-3">Hollyhill</td>
                <td className="p-3">Secures HTTP-only portal sessions</td>
                <td className="p-3">7 days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Data deletion request form */}
      <section className="max-w-xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-serif font-bold text-navy">GDPR Deletion Request</h3>
          <p className="text-gray-500 text-xs">
            Submit a request to audit, retrieve, or completely delete your non-clinical personal data files
          </p>
        </div>

        {requestSent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-xs text-emerald-800 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold">Request Received</h4>
            <p>Our GDPR officer will contact you at the email provided to verify identity and process the audit file.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 shadow-card rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Full Name</label>
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
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-navy">Audit Request Category</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none">
                <option>Export My Patient Personal Data Profile</option>
                <option>Request Total Data Deletion (Clinical audit needed)</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-navy text-white font-bold py-2.5 rounded-lg text-xs shadow transition-colors"
            >
              Submit Audit Request
            </button>
          </form>
        )}
      </section>

    </div>
  );
}
