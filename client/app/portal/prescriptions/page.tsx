"use client";

import { useState } from "react";
import { useLiveData } from "@/lib/useLiveData";
import {
  ClipboardList,
  Calendar,
  Pill,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
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
  const {
    data: prescriptions = [],
    loading,
    refetch,
  } = useLiveData<Prescription[]>("/prescriptions", {
    intervalMs: 20000,
    select: normalizePrescriptions,
    initialData: [],
  });

  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6 font-sans">
      <header className="flex items-center justify-between border-b border-gray-100 pb-4 gap-3">
        <div>
          <h1 className="font-sans text-2xl font-bold text-navy">
            My prescriptions
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Active medical scripts and dosage guidelines from Dr. Roghay.
            Updates live.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
          <button
            onClick={refetch}
            className="text-xs font-semibold text-gold border border-gold/20 hover:bg-gold/5 px-4 py-2 rounded-lg flex items-center gap-1.5 focus:outline-none transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Sync
          </button>
        </div>
      </header>

      {loading && prescriptions.length === 0 ? (
        <div className="h-[200px] shimmer rounded-2xl" />
      ) : prescriptions.length === 0 ? (
        <div className="border border-gray-100 rounded-2xl bg-white p-12 text-center space-y-4 max-w-md mx-auto">
          <ClipboardList className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-sans text-base font-bold text-navy">
            No active scripts
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            There are no medical prescriptions on file yet. Anything issued by
            the clinician will appear here as soon as it is finalised.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {prescriptions.map((rx) => {
            const isOpen = expanded === rx.id;
            return (
              <article
                key={rx.id}
                className="border border-gray-100 bg-white rounded-2xl shadow-sm hover:border-gold transition-colors flex flex-col overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : rx.id)}
                  className="p-5 text-left space-y-3"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-sans text-base font-bold text-navy truncate">
                          {rx.drugName}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          {rx.dosage} · {rx.frequency}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-navy bg-gold/10 border border-gold/20 px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">
                      {rx.duration}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {rx.instructions}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-50 pt-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      Issued {formatDate(rx.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-navy font-semibold">
                      {isOpen ? "Hide details" : "View details"}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isOpen ? "rotate-180 text-gold" : ""
                        }`}
                      />
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 space-y-4 animate-fade-up">
                    <DetailRow label="Drug" value={rx.drugName} />
                    <DetailRow label="Dosage" value={rx.dosage} />
                    <DetailRow label="Frequency" value={rx.frequency} />
                    <DetailRow label="Duration" value={rx.duration} />
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gold">
                        Instructions
                      </span>
                      <p className="text-xs text-navy leading-relaxed bg-white border border-gray-100 rounded-lg p-3 whitespace-pre-line">
                        {rx.instructions}
                      </p>
                    </div>
                    {rx.notes && (
                      <div className="space-y-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gold">
                          Doctor's notes
                        </span>
                        <p className="text-xs text-gray-600 italic border-l-2 border-gold/40 pl-3 whitespace-pre-line">
                          {rx.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs">
      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
        {label}
      </span>
      <span className="text-navy font-semibold text-right">{value}</span>
    </div>
  );
}
