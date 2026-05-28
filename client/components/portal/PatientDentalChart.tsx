"use client";

import { useMemo, useState } from "react";
import { useLiveData } from "@/lib/useLiveData";
import { ClipboardList, RefreshCw } from "lucide-react";

interface PatientDentalChartProps {
  patientId: string;
}

type ToothStatus =
  | "healthy"
  | "filled"
  | "crowned"
  | "extracted"
  | "root_canal"
  | "implant"
  | "needs_treatment";

interface ToothState {
  toothNumber: number;
  status: ToothStatus;
  notes: string;
  updatedAt?: string | null;
}

const STATUS_COLORS: Record<ToothStatus, { fill: string; border: string }> = {
  healthy: { fill: "#FFFFFF", border: "#E5E7EB" },
  filled: { fill: "#D1FAE5", border: "#10B981" },
  crowned: { fill: "#DBEAFE", border: "#2563EB" },
  extracted: { fill: "#E5E7EB", border: "#6B7280" },
  root_canal: { fill: "#FEF3C7", border: "#D97706" },
  implant: { fill: "#EDE9FE", border: "#7C3AED" },
  needs_treatment: { fill: "#FEE2E2", border: "#DC2626" },
};

const STATUS_LABELS: Record<ToothStatus, string> = {
  healthy: "Healthy",
  filled: "Filled",
  crowned: "Crowned",
  extracted: "Extracted",
  root_canal: "Root Canal",
  implant: "Implant",
  needs_treatment: "Needs Treatment",
};

// Universal numbering system. Upper arch is teeth 1–16 from patient's right
// to left, lower arch is 17–32 from patient's left to right.
const UPPER_RIGHT = [1, 2, 3, 4, 5, 6, 7, 8];
const UPPER_LEFT = [9, 10, 11, 12, 13, 14, 15, 16];
const LOWER_LEFT = [17, 18, 19, 20, 21, 22, 23, 24];
const LOWER_RIGHT = [25, 26, 27, 28, 29, 30, 31, 32];

export default function PatientDentalChart({ patientId }: PatientDentalChartProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  // Real-time polling — refetches every 30s and on tab focus.
  const {
    data: rawChart,
    loading,
    refetch,
  } = useLiveData<ToothState[]>(
    patientId ? `/dental-charts/${patientId}` : null,
    { intervalMs: 30000, initialData: [] }
  );

  const chart: ToothState[] = useMemo(() => {
    const list = Array.isArray(rawChart) ? rawChart : [];
    return Array.from({ length: 32 }, (_, idx) => {
      const num = idx + 1;
      const existing = list.find((t) => t.toothNumber === num);
      return (
        existing || {
          toothNumber: num,
          status: "healthy" as ToothStatus,
          notes: "No clinical notes recorded.",
        }
      );
    });
  }, [rawChart]);

  const teethByNumber = useMemo(() => {
    const map = new Map<number, ToothState>();
    chart.forEach((t) => map.set(t.toothNumber, t));
    return map;
  }, [chart]);

  const selectedTooth = selectedNumber
    ? teethByNumber.get(selectedNumber) || null
    : null;

  return (
    <div className="bg-white border border-gray-100 shadow-card rounded-2xl p-5 md:p-6 space-y-5">
      {/* Legend & live status */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {(Object.keys(STATUS_LABELS) as ToothStatus[]).map((status) => (
            <div
              key={status}
              className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-navy"
            >
              <span
                className="w-3.5 h-3.5 rounded border"
                style={{
                  backgroundColor: STATUS_COLORS[status].fill,
                  borderColor: STATUS_COLORS[status].border,
                }}
              />
              <span>{STATUS_LABELS[status]}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-gold hover:text-gold-dark text-xs font-semibold inline-flex items-center gap-1 focus:outline-none"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Reload chart
          </button>
        </div>
      </div>

      {loading && chart.every((t) => t.status === "healthy") ? (
        <div className="h-[260px] flex items-center justify-center text-xs text-gray-400">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mr-2" />
          Loading your dental chart…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Chart grid */}
          <div className="lg:col-span-2 bg-gray-50/70 rounded-xl p-4 md:p-6 space-y-6">
            <ArchSection
              label="Upper arch (Maxilla)"
              rightSide={UPPER_RIGHT}
              leftSide={UPPER_LEFT}
              teethByNumber={teethByNumber}
              selectedNumber={selectedNumber}
              onSelect={setSelectedNumber}
            />
            <div className="border-t border-dashed border-gray-200" />
            <ArchSection
              label="Lower arch (Mandible)"
              // Lower arch reads patient's right → left when looking at the
              // patient. Our raw numbers run 17..24 (patient's left) and
              // 25..32 (patient's right), so flip them visually.
              rightSide={LOWER_RIGHT.slice().reverse()}
              leftSide={LOWER_LEFT.slice().reverse()}
              teethByNumber={teethByNumber}
              selectedNumber={selectedNumber}
              onSelect={setSelectedNumber}
              flipForLower
            />
          </div>

          {/* Detail panel */}
          <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm space-y-4 min-h-[240px]">
            {selectedTooth ? (
              <>
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
                    Tooth Details
                  </span>
                  <h4 className="font-sans text-base font-bold text-navy mt-1">
                    Tooth #{selectedTooth.toothNumber}
                  </h4>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded border"
                      style={{
                        backgroundColor: STATUS_COLORS[selectedTooth.status].fill,
                        borderColor: STATUS_COLORS[selectedTooth.status].border,
                      }}
                    />
                    <span className="text-xs font-bold text-navy font-sans">
                      {STATUS_LABELS[selectedTooth.status]}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Dentist Observations
                  </span>
                  <p className="text-xs text-navy leading-relaxed bg-gray-50 rounded-lg p-3 whitespace-pre-line border border-gray-100 font-sans">
                    {selectedTooth.notes ||
                      "No specific comments or procedural details recorded."}
                  </p>
                </div>

                {selectedTooth.updatedAt && (
                  <p className="text-[10px] text-gray-400 font-sans">
                    Last updated{" "}
                    {new Date(selectedTooth.updatedAt).toLocaleString("en-IE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-10 space-y-2">
                <ClipboardList className="w-8 h-8 text-gray-300" />
                <h5 className="font-sans text-sm font-bold text-navy">
                  Select a tooth
                </h5>
                <p className="text-[11px] text-gray-400 max-w-[200px] leading-relaxed font-sans">
                  Click any tooth to see its clinical status and treatment
                  notes.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------- Sub-components -------------------- */

function ArchSection({
  label,
  rightSide,
  leftSide,
  teethByNumber,
  selectedNumber,
  onSelect,
  flipForLower,
}: {
  label: string;
  rightSide: number[];
  leftSide: number[];
  teethByNumber: Map<number, ToothState>;
  selectedNumber: number | null;
  onSelect: (n: number) => void;
  flipForLower?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 font-sans">
        <span>Patient&apos;s right</span>
        <span>{label}</span>
        <span>Patient&apos;s left</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {rightSide.map((n) => (
          <Tooth
            key={n}
            tooth={teethByNumber.get(n)!}
            selected={selectedNumber === n}
            onSelect={onSelect}
            flipForLower={flipForLower}
          />
        ))}
        <span className="mx-1 sm:mx-2 h-8 w-px bg-gray-300" aria-hidden />
        {leftSide.map((n) => (
          <Tooth
            key={n}
            tooth={teethByNumber.get(n)!}
            selected={selectedNumber === n}
            onSelect={onSelect}
            flipForLower={flipForLower}
          />
        ))}
      </div>
    </div>
  );
}

function Tooth({
  tooth,
  selected,
  onSelect,
  flipForLower,
}: {
  tooth: ToothState;
  selected: boolean;
  onSelect: (n: number) => void;
  flipForLower?: boolean;
}) {
  const colors = STATUS_COLORS[tooth.status];
  return (
    <button
      type="button"
      onClick={() => onSelect(tooth.toothNumber)}
      title={`Tooth #${tooth.toothNumber} — ${STATUS_LABELS[tooth.status]}`}
      className={`relative w-9 h-11 sm:w-10 sm:h-12 rounded-md font-sans text-[11px] font-bold transition-all flex items-center justify-center select-none ${
        selected
          ? "ring-2 ring-gold ring-offset-1 scale-105 shadow-md"
          : "hover:scale-[1.04] hover:shadow-sm"
      } ${flipForLower ? "rotate-180" : ""}`}
      style={{
        backgroundColor: colors.fill,
        color: tooth.status === "extracted" ? "#9CA3AF" : "#0A1628",
        border: `1.5px solid ${colors.border}`,
      }}
      aria-pressed={selected}
      aria-label={`Tooth ${tooth.toothNumber}, ${STATUS_LABELS[tooth.status]}`}
    >
      <span className={flipForLower ? "rotate-180" : ""}>
        {tooth.toothNumber}
      </span>
      {tooth.status === "extracted" && (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-base pointer-events-none"
        >
          ✕
        </span>
      )}
    </button>
  );
}
