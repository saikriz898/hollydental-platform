"use client";

import { useAuthStore } from "@/store/useAuthStore";
import BookingForm from "@/components/public/BookingForm";
import { Calendar, ShieldCheck, Sparkles } from "lucide-react";

export default function PortalBookingPage() {
  const { user } = useAuthStore();
  const firstName = user?.patientProfile?.firstName || "there";

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Page Header */}
      <header className="border-b border-gray-100 pb-6 space-y-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3" /> Secure Booking
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy">
          Book an Appointment
        </h1>
        <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-xl">
          Welcome back, {firstName}. Choose your treatment, pick a slot, and submit.
          Dr. Roghay&apos;s team will review and confirm your booking by email.
        </p>
      </header>

      {/* Reassurance Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          icon={<Calendar className="w-4 h-4 text-gold" />}
          title="No payment to book"
          body="Submit your request and we&rsquo;ll reach out to confirm. Pay only after the visit."
        />
        <InfoCard
          icon={<ShieldCheck className="w-4 h-4 text-gold" />}
          title="Reviewed by the clinic"
          body="Every appointment is approved by the clinical team to protect your slot."
        />
        <InfoCard
          icon={<Sparkles className="w-4 h-4 text-gold" />}
          title="Linked to your portal"
          body="Track status, reschedule, and message Dr. Roghay all in one place."
        />
      </div>

      {/* Booking Form */}
      <BookingForm />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-1.5">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-serif text-sm font-semibold text-navy">{title}</h4>
      </div>
      <p
        className="text-gray-500 text-xs leading-relaxed"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
}
