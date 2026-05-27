"use client";

import { useLiveData } from "@/lib/useLiveData";
import { ClipboardList, Calendar, Pill, HelpCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Prescription {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  notes?: string;
  createdAt: string;
}

function normalizePrescriptions(raw: any): Prescription[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.prescriptions)) return raw.prescriptions;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

export default function PatientPrescriptionsPage() {
  const { data: prescriptions = [], loading } = useLiveData<Prescription[]>("/prescriptions", {
    intervalMs: 30000,
    select: normalizePrescriptions,
    initialData: [],
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h1 className="font-serif text-2xl font-bold text-navy">My Prescriptions</h1>
        <p className="text-gray-500 text-xs mt-1">
          Review authorized medical scripts and drug dosage guidelines from Dr. Roghay.
        </p>
      </div>

      {loading ? (
        <div className="h-[200px] shimmer rounded-2xl" />
      ) : prescriptions.length === 0 ? (
        <div className="border border-gray-100 rounded-2xl bg-white p-12 text-center space-y-4 max-w-md mx-auto">
          <ClipboardList className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-serif text-base font-semibold text-navy">No Active Scripts</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            There are no medical prescriptions logged in your patient file. If you were recently issued a script, it will appear here once finalized by the clinician.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="border border-gray-100 bg-white rounded-2xl p-5 shadow-sm space-y-4 hover:border-gold transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-navy">
                        {rx.drugName}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">
                        {rx.dosage} &middot; {rx.frequency}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-navy bg-gold/10 px-2 py-0.5 rounded">
                    {rx.duration}
                  </span>
                </div>

                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg space-y-1.5 leading-relaxed">
                  <span className="font-bold text-navy block text-[10px] uppercase tracking-wider">
                    Instructions
                  </span>
                  <p>{rx.instructions}</p>
                </div>

                {rx.notes && (
                  <div className="text-[11px] text-gray-500 italic pl-1 border-l-2 border-gold/40">
                    <span className="font-bold text-navy not-italic block text-[9px] uppercase tracking-wider mb-0.5">
                      Doctor's Notes
                    </span>
                    {rx.notes}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] text-gray-400 border-t border-gray-50 pt-3 mt-4">
                <Calendar className="w-3.5 h-3.5" />
                <span>Issued on {formatDate(rx.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
