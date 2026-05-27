"use client";

import { useState } from "react";
import { CLINIC } from "@/lib/constants";
import { toast } from "@/lib/toast";
import { CheckCircle2, FileText, ArrowRight, ShieldCheck, HeartPulse } from "lucide-react";
import BookButton from "@/components/public/BookButton";

export default function NewPatientPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    gender: "female",
    emergencyContact: "",
    emergencyPhone: "",
    medicalConditions: [] as string[],
    medications: "",
    allergies: "",
    lastVisit: "",
    insurance: "none",
    gdpr: false,
    signature: ""
  });

  const conditions = [
    "High Blood Pressure",
    "Heart Disease",
    "Diabetes",
    "Asthma",
    "Bleeding Disorders",
    "Epilepsy",
    "Hepatitis"
  ];

  const handleConditionChange = (cond: string) => {
    setFormData((prev) => {
      const active = prev.medicalConditions.includes(cond)
        ? prev.medicalConditions.filter((c) => c !== cond)
        : [...prev.medicalConditions, cond];
      return { ...prev, medicalConditions: active };
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
        toast.warning("Please complete the required contact details.");
        return;
      }
    }
    if (step === 2) {
      // optional check
    }
    setStep((s) => s + 1);
  };

  const handlePrev = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gdpr || !formData.signature) {
      toast.warning("Please accept the GDPR terms and sign your name to register.");
      return;
    }
    setStep(4);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Interior Hero */}
      <section className="bg-navy text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/10 opacity-40" />
        <div className="relative z-10 space-y-3">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">New Patient Registration</h1>
          <p className="text-gray-300 text-xs md:text-sm tracking-wide uppercase">
            Complete your dental and medical history files prior to your visit
          </p>
        </div>
      </section>

      {/* Stepper Wizard */}
      <section className="max-w-xl mx-auto px-4">
        {step < 4 && (
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-8 text-xs text-navy font-semibold">
            <span className={`${step === 1 ? "text-gold" : ""}`}>1. Personal Info</span>
            <span className={`${step === 2 ? "text-gold" : ""}`}>2. Medical File</span>
            <span className={`${step === 3 ? "text-gold" : ""}`}>3. Consent & Sign</span>
          </div>
        )}

        {/* STEP 1: PERSONAL DETAILS */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-navy">Step 1: Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Phone *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-semibold text-navy">Postal Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Emergency Phone</label>
                <input
                  type="text"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3 rounded-lg text-xs shadow flex items-center justify-center gap-1"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: MEDICAL HISTORY */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-up">
            <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-1.5">
              <HeartPulse className="w-5 h-5 text-red-600" /> Step 2: Medical History
            </h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-navy block">Mark any medical conditions that apply:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {conditions.map((c) => (
                  <label key={c} className="flex items-center gap-2 border border-gray-100 p-2.5 rounded-lg bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.medicalConditions.includes(c)}
                      onChange={() => handleConditionChange(c)}
                      className="accent-gold"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">List any medications you are currently taking</label>
                <textarea
                  rows={2}
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">List any allergies (e.g. Penicillin, Latex)</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={handlePrev}
                className="border border-gray-200 text-navy font-semibold px-6 py-2.5 rounded-lg text-xs"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-2.5 rounded-lg text-xs shadow flex items-center gap-1"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: GDPR & SIGNATURE */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
            <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-gold" /> Step 3: Consent & Confirmation
            </h3>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-[10px] text-gray-500 leading-relaxed space-y-2">
              <p>
                **GDPR Compliance Notice**: Hollyhill Dental stores patient diagnostic files and treatment history safely in alignment with European Health Regulations. Under Irish Dental Council guidelines, your file will never be shared without authorization.
              </p>
              <label className="flex items-start gap-2 pt-2 cursor-pointer font-bold text-navy">
                <input
                  type="checkbox"
                  required
                  checked={formData.gdpr}
                  onChange={(e) => setFormData({ ...formData, gdpr: e.target.checked })}
                  className="accent-gold mt-0.5 shrink-0"
                />
                <span>I consent to Hollyhill Dental storing my digital clinical file.</span>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-navy">Electronic Signature (Type Full Name)</label>
              <input
                type="text"
                required
                value={formData.signature}
                onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                placeholder="Type your signature here..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-between gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                className="border border-gray-200 text-navy font-semibold px-6 py-2.5 rounded-lg text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-gold hover:bg-gold-dark text-navy font-bold px-8 py-2.5 rounded-lg text-xs shadow"
              >
                Submit Registration
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: REGISTRATION COMPLETE */}
        {step === 4 && (
          <div className="text-center py-10 space-y-6 animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center shadow-inner animate-pulse">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-navy font-semibold">Registration Completed!</h3>
              <p className="text-gray-500 text-xs">
                Welcome to the Hollyhill Dental family, {formData.firstName}. Your clinical account has been created.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left space-y-3 text-xs text-navy max-w-sm mx-auto">
              <h4 className="font-bold border-b border-gray-200 pb-1.5">What to bring to your visit:</h4>
              <ul className="space-y-1.5 list-disc pl-4 text-gray-500 text-[11px]">
                <li>Valid Photo ID (Passport/Drivers License)</li>
                <li>PPSN number (if claiming PRSI cleaning benefits)</li>
                <li>Details of medical insurance coverage</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={() => toast.info("Registration PDF download coming soon. The clinic team will email you a copy.")}
                className="bg-navy hover:bg-gray-800 text-white font-bold text-xs py-2.5 px-6 rounded-lg shadow flex items-center gap-1.5 justify-center"
              >
                <FileText className="w-4 h-4" /> Download Registration PDF
              </button>
              <BookButton
                label="Book Appointment"
                className="bg-gold hover:bg-gold-dark text-navy font-bold text-xs py-2.5 px-6 rounded-lg shadow text-center cursor-pointer"
              />
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
