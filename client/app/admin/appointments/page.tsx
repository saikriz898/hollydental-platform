"use client";

import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Plus, User, Info, Check, RefreshCw, ClipboardList, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showWalkin, setShowWalkin] = useState(false);

  // Walkin fields
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinReason, setWalkinReason] = useState("general-dentistry");

  // Clinical Quick Actions
  const [activeQuickAction, setActiveQuickAction] = useState<"rx" | "bill" | null>(null);
  const [rxDrugName, setRxDrugName] = useState("");
  const [rxDosage, setRxDosage] = useState("");
  const [rxFrequency, setRxFrequency] = useState("");
  const [rxDuration, setRxDuration] = useState("");
  const [rxInstructions, setRxInstructions] = useState("");
  const [rxNotes, setRxNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Billing Quick Action
  const [billDesc, setBillDesc] = useState("");
  const [billCost, setBillCost] = useState("");

  const appointmentsRef = useRef<any[]>([]);

  // Prefill invoice description with selected appointment service when selectedAppt changes
  useEffect(() => {
    if (selectedAppt) {
      setBillDesc((selectedAppt.serviceId || "dental-treatment").replace(/-/g, " ").toUpperCase());
      setActiveQuickAction(null); // reset forms when selecting another appointment
    }
  }, [selectedAppt]);

  const handleQuickTemplateSelect = (key: string) => {
    const templates: Record<string, any> = {
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
    const tpl = templates[key];
    if (!tpl) return;
    setRxDrugName(tpl.drugName);
    setRxDosage(tpl.dosage);
    setRxFrequency(tpl.frequency);
    setRxDuration(tpl.duration);
    setRxInstructions(tpl.instructions);
    setRxNotes(tpl.notes || "");
  };

  const handleQuickPrescribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt?.patientId) return;
    setActionLoading(true);
    try {
      await apiRequest("/prescriptions", {
        method: "POST",
        body: JSON.stringify({
          patientId: selectedAppt.patientId,
          drugName: rxDrugName,
          dosage: rxDosage,
          frequency: rxFrequency,
          duration: rxDuration,
          instructions: rxInstructions,
          notes: rxNotes,
        }),
      });
      toast.success("Prescription added.");
      setActiveQuickAction(null);
      setRxDrugName("");
      setRxDosage("");
      setRxFrequency("");
      setRxDuration("");
      setRxInstructions("");
      setRxNotes("");
    } catch (err: any) {
      toast.error("Failed to add prescription: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt?.patientId) return;
    const cost = parseFloat(billCost);
    if (isNaN(cost) || cost <= 0) {
      toast.warning("Please enter a valid cost.");
      return;
    }
    setActionLoading(true);
    try {
      await apiRequest("/billing/invoices", {
        method: "POST",
        body: JSON.stringify({
          patientId: selectedAppt.patientId,
          items: [{ description: billDesc, quantity: 1, price: cost }],
          subtotal: cost,
          vatAmount: 0,
          totalAmount: cost,
        }),
      });
      toast.success("Invoice generated and sent.");
      setActiveQuickAction(null);
      setBillDesc("");
      setBillCost("");
    } catch (err: any) {
      toast.error("Failed to generate invoice: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    appointmentsRef.current = appointments;
  }, [appointments]);

  useEffect(() => {
    fetchAppointments();

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }

    const interval = setInterval(() => {
      apiRequest("/appointments")
        .then((data) => {
          if (Array.isArray(data)) {
            const oldList = appointmentsRef.current;
            if (oldList.length > 0) {
              const newAppts = data.filter(
                (newA) => !oldList.some((oldA) => oldA.id === newA.id)
              );
              newAppts.forEach((appt) => {
                if (appt.status === "pending") {
                  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                    new Notification("New Appointment Request!", {
                      body: `A new booking request for ${(appt.serviceId || "dental-treatment").replace("-", " ").toUpperCase()} on ${formatDate(appt.appointmentDate)} at ${appt.appointmentTime} has been submitted.`,
                    });
                  }
                }
              });
            }
            setAppointments(data);
          }
        })
        .catch(() => {});
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    apiRequest("/appointments")
      .then((data) => setAppointments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedAppt) return;
    setUpdating(true);
    try {
      const result = await apiRequest(`/appointments/${selectedAppt.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setAppointments(prev => prev.map(a => a.id === selectedAppt.id ? { ...a, status: result.status } : a));
      setSelectedAppt((prev: any) => ({ ...prev, status: result.status }));
      toast.success("Status updated.");
    } catch (error) {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await apiRequest("/appointments", {
        method: "POST",
        body: JSON.stringify({
          patientId: "walk-in-patient",
          serviceId: walkinReason,
          appointmentDate: new Date().toISOString().split("T")[0],
          appointmentTime: "11:30", // default next slot
          notes: `Walk-in: ${walkinName}. Phone: ${walkinPhone}`,
        }),
      });

      setAppointments(prev => [...prev, result.appointment]);
      setShowWalkin(false);
      setWalkinName("");
      setWalkinPhone("");
      toast.success("Walk-in check-in completed.");
    } catch (error) {
      toast.error("Walk-in booking failed.");
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "confirmed") return "border-l-4 border-emerald-500 bg-emerald-50 text-emerald-800";
    if (status === "pending") return "border-l-4 border-amber-500 bg-amber-50 text-amber-800";
    if (status === "cancelled") return "border-l-4 border-red-500 bg-red-50 text-red-800";
    return "border-l-4 border-navy bg-gray-50 text-navy";
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">Visits Schedule</h1>
          <p className="text-gray-500 text-xs mt-1">Manage clinical calendars, check status, and check-in walkins</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowWalkin(true)}
            className="border border-navy hover:bg-gray-50 text-navy font-semibold px-4 py-2 rounded-lg text-xs transition-colors focus:outline-none"
          >
            Walk-in check-in +
          </button>
          <button
            onClick={fetchAppointments}
            className="bg-gold hover:bg-gold-dark text-navy font-bold px-4 py-2 rounded-lg text-xs shadow transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-[300px] shimmer rounded-2xl" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Appointment List (Desktop split layout) */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-serif text-sm font-bold text-navy">Today's Appointments Queue</h3>
            <div className="space-y-3">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  onClick={() => setSelectedAppt(appt)}
                  className={`p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all flex items-center justify-between ${getStatusColor(
                    appt.status
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gold" />
                    <div>
                      <span className="block text-xs font-bold">{(appt.serviceId || "dental-treatment").replace("-", " ").toUpperCase()}</span>
                      <span className="block text-[10px] opacity-75 font-normal">
                        Time: {appt.appointmentTime} &middot; Date: {formatDate(appt.appointmentDate)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-widest bg-white/60 px-2 py-0.5 rounded border border-gray-200">
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side Detail Slide-in Panel */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 min-h-[300px]">
            {selectedAppt ? (
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3 relative">
                  <span className="text-[9px] uppercase font-bold text-gold tracking-wider">Appointment Detail</span>
                  <h4 className="font-serif text-base font-bold text-navy mt-0.5">
                    {selectedAppt.serviceId.replace("-", " ")}
                  </h4>
                  <button
                    onClick={() => setSelectedAppt(null)}
                    className="absolute right-0 top-0 text-gray-400 hover:text-navy text-sm font-bold"
                  >
                    &times;
                  </button>
                </div>

                <div className="text-xs text-gray-600 space-y-2">
                  {selectedAppt.patient && (
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">Patient Details</span>
                      <span className="font-bold text-navy block text-xs">
                        {selectedAppt.patient.firstName} {selectedAppt.patient.lastName}
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        Phone: {selectedAppt.patient.phone} &middot; Email: {selectedAppt.patient.email}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase">Schedule Date & Time</span>
                    <span className="font-bold text-navy">{formatDate(selectedAppt.appointmentDate)} at {selectedAppt.appointmentTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase">Booking Status</span>
                    <span
                      className={`font-bold ${
                        selectedAppt.status === "confirmed"
                          ? "text-emerald-600"
                          : selectedAppt.status === "pending"
                          ? "text-amber-600"
                          : "text-navy"
                      }`}
                    >
                      {selectedAppt.status === "pending"
                        ? "Awaiting Approval"
                        : selectedAppt.status?.charAt(0).toUpperCase() +
                          selectedAppt.status?.slice(1)}
                    </span>
                  </div>
                  {selectedAppt.notes && (
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">Notes</span>
                      <p className="bg-gray-50 p-2.5 rounded text-[11px] leading-relaxed italic">{selectedAppt.notes}</p>
                    </div>
                  )}
                </div>

                {/* Status Update Dropdown */}
                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <label className="text-[10px] font-bold text-navy block">Update Visit Status</label>
                  <select
                    disabled={updating}
                    value={selectedAppt.status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="arrived">Arrived</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Quick Actions for Prescriptions and Billing */}
                {selectedAppt.patient && (
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <label className="text-[10px] font-bold text-navy block">Clinical Quick Actions</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveQuickAction(activeQuickAction === "rx" ? null : "rx")}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          activeQuickAction === "rx"
                            ? "bg-navy text-white border-navy"
                            : "bg-white text-navy border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <ClipboardList className="w-3.5 h-3.5" /> Prescribe
                      </button>
                      <button
                        onClick={() => setActiveQuickAction(activeQuickAction === "bill" ? null : "bill")}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          activeQuickAction === "bill"
                            ? "bg-navy text-white border-navy"
                            : "bg-white text-navy border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" /> Bill Patient
                      </button>
                    </div>

                    {/* Quick Prescription Form */}
                    {activeQuickAction === "rx" && (
                      <form onSubmit={handleQuickPrescribe} className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-2 animate-fade-in text-[11px] text-left">
                        <div className="border-b border-gray-200 pb-1.5 flex justify-between items-center">
                          <span className="font-bold text-navy">New Prescription Script</span>
                          <select
                            onChange={(e) => handleQuickTemplateSelect(e.target.value)}
                            className="bg-white border border-gray-200 rounded p-1 text-[9px] focus:outline-none"
                          >
                            <option value="">-- Template --</option>
                            <option value="amox">Amoxicillin (Antibiotic)</option>
                            <option value="metro">Metronidazole (Antibiotic)</option>
                            <option value="ibup">Ibuprofen (Painkiller)</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Drug Name"
                            required
                            value={rxDrugName}
                            onChange={(e) => setRxDrugName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded p-1.5 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Dosage"
                            required
                            value={rxDosage}
                            onChange={(e) => setRxDosage(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded p-1.5 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Frequency"
                            required
                            value={rxFrequency}
                            onChange={(e) => setRxFrequency(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded p-1.5 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Duration"
                            required
                            value={rxDuration}
                            onChange={(e) => setRxDuration(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded p-1.5 focus:outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Pharmacist Instructions"
                          required
                          value={rxInstructions}
                          onChange={(e) => setRxInstructions(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded p-1.5 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Clinical notes (optional)"
                          value={rxNotes}
                          onChange={(e) => setRxNotes(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded p-1.5 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="w-full bg-navy hover:bg-gray-800 text-white font-bold py-1.5 rounded text-[10px] transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading ? "Saving..." : "Prescribe Medication"}
                        </button>
                      </form>
                    )}

                    {/* Quick Billing Form */}
                    {activeQuickAction === "bill" && (
                      <form onSubmit={handleQuickBill} className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-2 animate-fade-in text-[11px] text-left">
                        <span className="font-bold text-navy block border-b border-gray-200 pb-1.5">Generate Billing Invoice</span>
                        <input
                          type="text"
                          placeholder="Treatment Description"
                          required
                          value={billDesc}
                          onChange={(e) => setBillDesc(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded p-1.5 focus:outline-none"
                        />
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-gray-400">&euro;</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Cost Fee"
                            required
                            value={billCost}
                            onChange={(e) => setBillCost(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded pl-5 pr-2 py-1.5 focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-1.5 rounded text-[10px] transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading ? "Generating..." : "Generate & Send Invoice"}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12 space-y-2">
                <Info className="w-8 h-8 text-gray-300" />
                <div>
                  <h5 className="font-serif text-sm font-semibold text-navy">No Appointment Selected</h5>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">
                    Click any queued appointment in the list to update clinical status or review notes.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Walk-in Modal */}
      {showWalkin && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 space-y-6 animate-fade-up border border-gray-200 shadow-2xl relative">
            <button
              onClick={() => setShowWalkin(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-navy text-lg font-bold focus:outline-none"
            >
              &times;
            </button>
            <form onSubmit={handleWalkin} className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <h4 className="font-serif text-lg font-bold text-navy">Walk-in Patient Check-in</h4>
                <p className="text-gray-500 text-[10px] mt-0.5">Link a walk-in visitor to today's schedule</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Reason for Visit</label>
                  <select
                    value={walkinReason}
                    onChange={(e) => setWalkinReason(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  >
                    <option value="general-dentistry">General Dentistry Consultation</option>
                    <option value="emergency-dentistry">Severe Toothache / Emergency</option>
                    <option value="teeth-cleaning">Hygiene / Scaling</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-2.5 rounded-lg text-xs shadow-md transition-colors"
              >
                Check In Walk-in Patient
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
