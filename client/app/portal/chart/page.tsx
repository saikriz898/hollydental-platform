"use client";

import { useAuthStore } from "@/store/useAuthStore";
import PatientDentalChart from "@/components/portal/PatientDentalChart";
import { ClipboardList } from "lucide-react";

export default function PatientChartPage() {
  const { user } = useAuthStore();
  const patientId = user?.patientProfile?.id;

  return (
    <div className="space-y-6">
      <header className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-gold/10 text-gold text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            <ClipboardList className="w-3 h-3" /> Dental Record
          </span>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mt-1">
          Interactive Dental Chart
        </h1>
        <p className="text-gray-500 text-xs mt-1">
          View your teeth health status and check dentist observation notes.
        </p>
      </header>

      {patientId ? (
        <PatientDentalChart patientId={patientId} />
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-xs text-gray-400">
          No patient profile linked. Please contact the clinic administration.
        </div>
      )}
    </div>
  );
}
