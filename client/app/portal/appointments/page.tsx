"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { CalendarDays, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PortalAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    apiRequest("/appointments/my")
      .then((data) => setAppointments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCancel = async (id: string) => {
    const ok = await toast.confirm({
      title: "Cancel this appointment?",
      message: "We'll free up the slot. You can rebook anytime.",
      confirmText: "Yes, cancel",
      danger: true,
    });
    if (!ok) return;
    try {
      await apiRequest(`/appointments/${id}`, { method: "DELETE" });
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.success("Appointment cancelled.");
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to cancel appointment. Contact the clinic."
      );
    }
  };

  const nowStr = new Date().toISOString().split("T")[0];

  const upcoming = appointments.filter((a) => a.appointmentDate >= nowStr);
  const past = appointments.filter((a) => a.appointmentDate < nowStr);

  const activeList = activeTab === "upcoming" ? upcoming : past;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">My Appointments</h1>
          <p className="text-gray-500 text-xs mt-1">Review upcoming visits and dental history logs</p>
        </div>
        <Link
          href="/portal/booking"
          className="bg-gold hover:bg-gold-dark text-navy font-bold text-xs py-2 px-5 rounded-lg shadow-md transition-colors"
        >
          Book New +
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 gap-6 text-xs font-semibold text-navy">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-2.5 border-b-2 transition-all ${
            activeTab === "upcoming" ? "border-gold text-gold" : "border-transparent text-gray-400"
          }`}
        >
          Upcoming Visits ({upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`pb-2.5 border-b-2 transition-all ${
            activeTab === "past" ? "border-gold text-gold" : "border-transparent text-gray-400"
          }`}
        >
          Past Treatments ({past.length})
        </button>
      </div>

      {loading ? (
        <div className="h-[200px] shimmer rounded-xl" />
      ) : activeList.length === 0 ? (
        <div className="border border-gray-100 rounded-2xl bg-white p-12 text-center space-y-4 max-w-md mx-auto">
          <CalendarDays className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-serif text-base font-semibold text-navy">No Appointments Found</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            You don't have any {activeTab === "upcoming" ? "upcoming" : "completed"} visits logged in our system.
          </p>
          {activeTab === "upcoming" && (
            <Link
              href="/portal/booking"
              className="bg-gold hover:bg-gold-dark text-navy font-bold text-xs py-2 px-6 rounded-lg inline-block shadow"
            >
              Book First Appointment
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeList.map((appt) => (
            <div
              key={appt.id}
              className="border border-gray-100 bg-white rounded-2xl p-5 shadow-sm space-y-4 hover:border-gold transition-colors flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded">
                    {appt.serviceId.replace("-", " ")}
                  </span>
                  <h4 className="font-serif text-base font-bold text-navy mt-2">
                    {formatDate(appt.appointmentDate)} at {appt.appointmentTime}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Dentist: Dr. Roghay Alizadeh</p>
                </div>
                <span className="bg-navy/5 text-navy text-[8px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {appt.status}
                </span>
              </div>

              {appt.notes && (
                <p className="text-gray-500 text-[10px] bg-gray-50 p-2.5 rounded-lg leading-relaxed">
                  <span className="font-bold text-navy block mb-0.5">Notes:</span>
                  {appt.notes}
                </p>
              )}

              {activeTab === "upcoming" ? (
                <div className="flex gap-4 border-t border-gray-50 pt-4 mt-auto">
                  <Link
                    href={`/portal/appointments/${appt.id}`}
                    className="text-xs font-semibold text-gold hover:text-gold-dark transition-colors"
                  >
                    View details →
                  </Link>
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors focus:outline-none"
                  >
                    Cancel Booking
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 border-t border-gray-50 pt-4 mt-auto">
                  <Link
                    href={`/portal/appointments/${appt.id}`}
                    className="text-xs font-semibold text-gold hover:text-gold-dark transition-colors"
                  >
                    View details →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
