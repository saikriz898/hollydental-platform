"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useLiveData } from "@/lib/useLiveData";
import { toast } from "@/lib/toast";
import { Plus } from "lucide-react";

interface PatientLite {
  id: string;
  firstName: string;
  lastName: string;
}

interface Prescription {
  id: string;
  patientId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  notes?: string;
  createdAt: string;
}

function normalizePatients(raw: any): PatientLite[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.patients)) return raw.patients;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}
function normalizePrescriptions(raw: any): Prescription[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.prescriptions)) return raw.prescriptions;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

const TEMPLATES: Record<string, Partial<Prescription>> = {
  amox: {
    drugName: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times a day",
    duration: "7 days",
    instructions: "Take with food. Complete the full course.",
    notes: "Abscess swelling prevention",
  },
  metro: {
    drugName: "Metronidazole",
    dosage: "400mg",
    frequency: "Three times a day",
    duration: "5 days",
    instructions: "Do NOT drink alcohol while taking this medication.",
    notes: "Acute dental infection treatment",
  },
  ibup: {
    drugName: "Ibuprofen",
    dosage: "400mg",
    frequency: "Every 6 hours as needed",
    duration: "3 days",
    instructions: "Take with or after food. Maximum 3 tablets daily.",
    notes: "Post-extraction pain management",
  },
};

export default function AdminPrescriptionsPage() {
  const { data: patients = [] } = useLiveData<PatientLite[]>("/patients", {
    intervalMs: 0,
    select: normalizePatients,
    initialData: [],
  });

  const {
    data: prescriptions = [],
    loading,
    refetch,
  } = useLiveData<Prescription[]>("/prescriptions", {
    intervalMs: 30000,
    select: normalizePrescriptions,
    initialData: [],
  });

  const [showForm, setShowForm] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [patientId, setPatientId] = useState("");
  const [drugName, setDrugName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");

  // Default to first patient when list loads
  useEffect(() => {
    if (!patientId && patients.length > 0) {
      setPatientId(patients[0].id);
    }
  }, [patients, patientId]);

  const handleTemplateSelect = (key: string) => {
    const tpl = TEMPLATES[key];
    if (!tpl) return;
    setDrugName(tpl.drugName || "");
    setDosage(tpl.dosage || "");
    setFrequency(tpl.frequency || "");
    setDuration(tpl.duration || "");
    setInstructions(tpl.instructions || "");
    setNotes(tpl.notes || "");
  };

  const resetForm = () => {
    setDrugName("");
    setDosage("");
    setFrequency("");
    setDuration("");
    setInstructions("");
    setNotes("");
  };

  const handleCreateRx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast.warning("Please select a patient first.");
      return;
    }
    setBtnLoading(true);
    try {
      await apiRequest("/prescriptions", {
        method: "POST",
        body: JSON.stringify({
          patientId,
          drugName,
          dosage,
          frequency,
          duration,
          instructions,
          notes,
        }),
      });
      setShowForm(false);
      resetForm();
      refetch();
      toast.success("Prescription added.");
    } catch (error: any) {
      toast.error(`Failed to create prescription: ${error?.message || "Please try again."}`);
    } finally {
      setBtnLoading(false);
    }
  };

  const patientName = (id: string) => {
    const p = patients.find((x) => x.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "—";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">Prescriptions Manager</h1>
          <p className="text-gray-500 text-xs mt-1">
            Generate drug scripts, pre-fill template dosages, and send to patient portals.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={patients.length === 0}
          className="bg-gold hover:bg-gold-dark text-navy font-bold px-4 py-2 rounded-lg text-xs shadow flex items-center gap-1 focus:outline-none disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> New Prescription
        </button>
      </div>

      {loading && prescriptions.length === 0 ? (
        <div className="h-[200px] shimmer rounded-2xl" />
      ) : prescriptions.length === 0 ? (
        <div className="border border-gray-200 rounded-2xl bg-white p-12 text-center space-y-3 max-w-md mx-auto">
          <h3 className="font-serif text-base font-semibold text-navy">No Prescriptions</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            No prescriptions have been issued yet.
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-navy text-white">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Drug</th>
                <th className="p-4">Dosage</th>
                <th className="p-4">Instructions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((rx) => (
                <tr
                  key={rx.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-500">
                    {new Date(rx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-navy">{patientName(rx.patientId)}</td>
                  <td className="p-4 font-bold text-navy">{rx.drugName}</td>
                  <td className="p-4">
                    {rx.dosage} &middot; {rx.frequency}
                  </td>
                  <td className="p-4 truncate max-w-xs">{rx.instructions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] p-6 space-y-4 shadow-2xl relative animate-fade-up">
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-navy text-lg font-bold"
            >
              &times;
            </button>

            <form onSubmit={handleCreateRx} className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h4 className="font-serif text-lg font-bold text-navy">New Prescription</h4>
                <p className="text-gray-500 text-[10px]">
                  Create an authorized clinical drug instruction.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy block">Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                >
                  {patients.length === 0 ? (
                    <option value="">No patients</option>
                  ) : (
                    patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy block">
                  Pre-fill Template Dosage
                </label>
                <select
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                >
                  <option value="">-- Choose Template --</option>
                  <option value="amox">Amoxicillin 500mg (Antibiotic)</option>
                  <option value="metro">Metronidazole 400mg (Antibiotic)</option>
                  <option value="ibup">Ibuprofen 400mg (Painkiller)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Drug Name</label>
                  <input
                    type="text"
                    required
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Dosage</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Frequency</label>
                  <input
                    type="text"
                    required
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">
                  Pharmacist Instructions
                </label>
                <input
                  type="text"
                  required
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Clinical Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={btnLoading}
                className="w-full bg-navy text-white font-bold py-2.5 rounded-lg text-xs shadow-md transition-colors disabled:opacity-50"
              >
                {btnLoading ? "Generating script…" : "Generate and Send Script"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
