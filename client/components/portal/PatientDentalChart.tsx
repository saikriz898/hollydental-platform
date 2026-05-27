"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import { ClipboardList, RefreshCw } from "lucide-react";

interface PatientDentalChartProps {
  patientId: string;
}

interface ToothState {
  toothNumber: number;
  status: "healthy" | "filled" | "crowned" | "extracted" | "root_canal" | "implant" | "needs_treatment";
  notes: string;
}

const statusColors: Record<string, string> = {
  healthy: "#FFFFFF",
  filled: "#D1FAE5", // light green
  crowned: "#DBEAFE", // light blue
  extracted: "#E5E7EB", // light grey
  root_canal: "#FEF3C7", // light yellow
  implant: "#EDE9FE", // light purple
  needs_treatment: "#FEE2E2", // light red
};

const statusLabels: Record<string, string> = {
  healthy: "Healthy",
  filled: "Filled",
  crowned: "Crowned",
  extracted: "Extracted",
  root_canal: "Root Canal",
  implant: "Implant",
  needs_treatment: "Needs Treatment",
};

export default function PatientDentalChart({ patientId }: PatientDentalChartProps) {
  const [chart, setChart] = useState<ToothState[]>([]);
  const [selectedTooth, setSelectedTooth] = useState<ToothState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      fetchChart();
    }
  }, [patientId]);

  const fetchChart = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/dental-charts/${patientId}`);
      // Ensure all 32 teeth are represented
      const fullChart = Array.from({ length: 32 }, (_, idx) => {
        const num = idx + 1;
        const existing = data.find((t: any) => t.toothNumber === num);
        return existing || { toothNumber: num, status: "healthy", notes: "No clinical notes recorded." };
      });
      setChart(fullChart);
    } catch (error) {
      console.error("Failed to load dental chart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToothClick = (tooth: ToothState) => {
    setSelectedTooth(tooth);
  };

  const getTeethCoords = (number: number) => {
    // Upper arch (1 to 16) - arc layout
    if (number <= 16) {
      const angle = (Math.PI * (number - 1)) / 15 - Math.PI; // -pi to 0
      const radiusX = 220;
      const radiusY = 80;
      const cx = 300 + radiusX * Math.cos(angle);
      const cy = 110 + radiusY * Math.sin(angle);
      return { cx, cy };
    }
    // Lower arch (17 to 32) - reverse arc layout
    const idx = number - 17;
    const angle = (Math.PI * (15 - idx)) / 15 - Math.PI; // -pi to 0
    const radiusX = 220;
    const radiusY = 80;
    const cx = 300 + radiusX * Math.cos(angle);
    const cy = 250 - radiusY * Math.sin(angle); // mirror vertically
    return { cx, cy };
  };

  return (
    <div className="bg-white border border-gray-100 shadow-card rounded-2xl p-6">
      {/* Legend & Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5 text-xs text-navy font-medium">
              <span
                className="w-3.5 h-3.5 rounded border border-gray-300"
                style={{ backgroundColor: color }}
              />
              <span>{statusLabels[status]}</span>
            </div>
          ))}
        </div>
        <button
          onClick={fetchChart}
          className="text-gold hover:text-gold-dark text-xs font-semibold flex items-center gap-1 focus:outline-none"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reload Chart
        </button>
      </div>

      {loading ? (
        <div className="h-[360px] flex items-center justify-center text-xs text-gray-400">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mr-2" />
          Loading your dental chart...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SVG Mouth Chart Area */}
          <div className="lg:col-span-2 flex items-center justify-center bg-gray-50 rounded-xl p-4 overflow-x-auto">
            <svg width="600" height="360" className="max-w-full">
              {/* Arch Guidelines */}
              <path
                d="M 80 110 A 220 80 0 0 1 520 110"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M 80 250 A 220 80 0 0 0 520 250"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Arcs labels */}
              <text x="300" y="25" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontWeight="bold" letterSpacing="1">
                UPPER ARCH (MAXILLA)
              </text>
              <text x="300" y="345" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontWeight="bold" letterSpacing="1">
                LOWER ARCH (MANDIBLE)
              </text>

              {/* Draw Teeth */}
              {chart.map((tooth) => {
                const { cx, cy } = getTeethCoords(tooth.toothNumber);
                const isSelected = selectedTooth?.toothNumber === tooth.toothNumber;

                return (
                  <g
                    key={tooth.toothNumber}
                    onClick={() => handleToothClick(tooth)}
                    className="cursor-pointer group"
                  >
                    {/* Tooth outline box/shape */}
                    <rect
                      x={cx - 14}
                      y={cy - 18}
                      width="28"
                      height="36"
                      rx="6"
                      fill={statusColors[tooth.status]}
                      stroke={isSelected ? "#C9A96E" : "#9CA3AF"}
                      strokeWidth={isSelected ? "3" : "1.5"}
                      className="transition-all hover:filter hover:brightness-95"
                    />
                    
                    {/* X mark on extracted teeth */}
                    {tooth.status === "extracted" && (
                      <path
                        d={`M ${cx - 8} ${cy - 10} L ${cx + 8} ${cy + 10} M ${cx + 8} ${cy - 10} L ${cx - 8} ${cy + 10}`}
                        stroke="#DC2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    )}

                    {/* Tooth number text label inside */}
                    <text
                      x={cx}
                      y={cy + 5}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#0A1628"
                      className="pointer-events-none select-none"
                    >
                      {tooth.toothNumber}
                    </text>

                    {/* Tooltip trigger on hover */}
                    <title>{`Tooth #${tooth.toothNumber}: ${statusLabels[tooth.status]} ${
                      tooth.notes ? `(${tooth.notes})` : ""
                    }`}</title>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right Read-only Info Side Panel */}
          <div className="border border-gray-100 rounded-xl p-5 flex flex-col justify-between bg-white shadow-sm">
            {selectedTooth ? (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold">Tooth Details</span>
                  <h4 className="font-serif text-lg font-semibold text-navy mt-0.5">
                    Tooth #{selectedTooth.toothNumber}
                  </h4>
                </div>

                {/* Status Indicator */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">Status</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded border border-gray-300"
                      style={{ backgroundColor: statusColors[selectedTooth.status] }}
                    />
                    <span className="text-xs font-bold text-navy">
                      {statusLabels[selectedTooth.status]}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">Dentist Observations</span>
                  <p className="text-xs text-navy leading-relaxed bg-gray-50 rounded-lg p-3 whitespace-pre-line border border-gray-100">
                    {selectedTooth.notes || "No specific comments or procedural details recorded."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-10 space-y-2">
                <ClipboardList className="w-8 h-8 text-gray-300" />
                <div>
                  <h5 className="font-serif text-sm font-semibold text-navy">Select a Tooth</h5>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-[200px]">
                    Click any tooth number on the mouth diagram to see its clinical status and treatment history notes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
