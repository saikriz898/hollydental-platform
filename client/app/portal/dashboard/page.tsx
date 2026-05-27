"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useLiveData } from "@/lib/useLiveData";
import {
  CalendarDays,
  MessageSquare,
  ChevronRight,
  Bell,
  ClipboardCheck,
  ShieldCheck,
  ClipboardList,
  Receipt,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

function normalizeArray<T>(raw: any): T[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.appointments)) return raw.appointments;
  if (Array.isArray(raw?.messages)) return raw.messages;
  return [];
}

export default function PatientDashboardPage() {
  const { user } = useAuthStore();
  const patientId = user?.patientProfile?.id;

  const { data: appointments = [], loading: lAppts } = useLiveData<any[]>(
    "/appointments/my",
    {
      intervalMs: 30000,
      select: (raw) => normalizeArray<any>(raw),
      initialData: [],
    }
  );

  const { data: messages = [], loading: lMsgs } = useLiveData<any[]>(
    patientId ? `/messages/${patientId}` : null,
    {
      intervalMs: 15000,
      select: (raw) => normalizeArray<any>(raw),
      initialData: [],
    }
  );

  const loading = lAppts || lMsgs;

  const nextAppt = useMemo(
    () =>
      [...appointments]
        .filter((a) => a?.status === "confirmed" || a?.status === "pending")
        .sort(
          (a, b) =>
            new Date(
              `${a.appointmentDate}T${a.appointmentTime || "00:00"}`
            ).getTime() -
            new Date(
              `${b.appointmentDate}T${b.appointmentTime || "00:00"}`
            ).getTime()
        )[0],
    [appointments]
  );

  const pendingCount = useMemo(
    () => appointments.filter((a) => a?.status === "pending").length,
    [appointments]
  );

  const unreadCount = useMemo(
    () =>
      messages.filter((m) => m?.senderRole === "admin" && !m?.isRead).length,
    [messages]
  );

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.patientProfile?.firstName || "there";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Welcome back. Here&apos;s a quick view of your dental care.
          </p>
        </div>
        <Link href="/portal/notifications" className="relative" title="Notifications">
          <Bell className="w-5 h-5 text-navy hover:text-gold cursor-pointer" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <Link
          href="/portal/chart"
          className="border border-gray-100 bg-white hover:border-gold hover:shadow-sm rounded-xl p-5 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-navy truncate">
                Dental Chart
              </span>
              <span className="block text-[9px] text-gray-400 truncate">
                Teeth health & notes
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </Link>

        <Link
          href="/portal/booking"
          className="border border-gray-100 bg-white hover:border-gold hover:shadow-sm rounded-xl p-5 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-navy truncate">
                Request Visit
              </span>
              <span className="block text-[9px] text-gray-400 truncate">
                Submit booking request
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </Link>

        <Link
          href="/portal/messages"
          className="border border-gray-100 bg-white hover:border-gold hover:shadow-sm rounded-xl p-5 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-navy truncate">
                Message Clinic
              </span>
              <span className="block text-[9px] text-gray-400 truncate">
                Direct chat with doctor
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </Link>

        <Link
          href="/portal/appointments"
          className="border border-gray-100 bg-white hover:border-gold hover:shadow-sm rounded-xl p-5 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-navy truncate">
                My Requests
              </span>
              <span className="block text-[9px] text-gray-400 truncate">
                {pendingCount > 0
                  ? `${pendingCount} awaiting approval`
                  : "All approved"}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </Link>

        <Link
          href="/portal/prescriptions"
          className="border border-gray-100 bg-white hover:border-gold hover:shadow-sm rounded-xl p-5 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-navy truncate">
                Prescriptions
              </span>
              <span className="block text-[9px] text-gray-400 truncate">
                View issued scripts
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </Link>

        <Link
          href="/portal/invoices"
          className="border border-gray-100 bg-white hover:border-gold hover:shadow-sm rounded-xl p-5 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-navy truncate">
                Billing Statements
              </span>
              <span className="block text-[9px] text-gray-400 truncate">
                Invoices & receipts
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </Link>
      </div>

      {loading && appointments.length === 0 ? (
        <div className="h-[200px] shimmer rounded-xl w-full" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-100 bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-navy">
                Next Scheduled Visit
              </h3>

              {nextAppt ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded">
                        {String(nextAppt.serviceId || "appointment").replace(
                          /-/g,
                          " "
                        )}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-navy mt-1.5">
                        {formatDate(nextAppt.appointmentDate)} at{" "}
                        {nextAppt.appointmentTime}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Dentist: Dr. Roghay Alizadeh
                      </p>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        nextAppt.status === "confirmed"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {nextAppt.status === "pending"
                        ? "Awaiting confirmation"
                        : nextAppt.status}
                    </span>
                  </div>

                  <div className="flex gap-4 border-t border-gray-50 pt-4 text-xs font-semibold">
                    <a
                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                        (nextAppt.serviceId || "Dental visit") + " - Hollyhill"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy hover:text-gold flex items-center gap-1"
                    >
                      Add to Calendar
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-xs text-gray-400">
                    You don&apos;t have any upcoming appointments yet.
                  </p>
                  <Link
                    href="/portal/booking"
                    className="bg-gold hover:bg-gold-dark text-navy text-xs font-bold py-2 px-5 rounded-lg inline-block shadow"
                  >
                    Request a visit
                  </Link>
                </div>
              )}
            </div>

            {appointments.length > 1 && (
              <div className="border border-gray-100 bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-xs font-bold text-navy">
                  Recent Requests
                </h3>
                <div className="space-y-2.5 text-xs text-navy font-semibold">
                  {appointments.slice(0, 3).map((appt) => (
                    <div
                      key={appt.id}
                      className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                    >
                      <div>
                        <span className="block">
                          {String(appt.serviceId || "appointment").replace(
                            /-/g,
                            " "
                          )}
                        </span>
                        <span className="block text-[10px] text-gray-400 font-normal">
                          {formatDate(appt.appointmentDate)}
                        </span>
                      </div>
                      <span className="text-[10px] capitalize text-gray-400">
                        {appt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="border border-gray-100 bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-navy">
                Request status
              </h3>
              {pendingCount > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <ClipboardCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-navy">
                        {pendingCount} pending
                      </span>
                      <span className="block text-[11px] text-gray-500">
                        The clinic will email you once approved.
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/portal/appointments"
                    className="w-full bg-navy hover:bg-gray-800 text-white font-bold py-2.5 rounded-lg text-xs shadow-md block text-center uppercase tracking-wider"
                  >
                    View my requests
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-navy">
                        You&apos;re all set
                      </span>
                      <span className="block text-[11px] text-gray-500">
                        No pending requests right now.
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/portal/booking"
                    className="text-[11px] font-bold text-gold hover:underline"
                  >
                    Request a new visit →
                  </Link>
                </div>
              )}
            </div>

            {unreadCount > 0 && (
              <div className="border border-red-100 bg-red-50/20 rounded-2xl p-6 shadow-sm space-y-2">
                <h4 className="font-serif text-xs font-bold text-red-600 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> Message from Dr. Roghay
                </h4>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  You have {unreadCount} unread message
                  {unreadCount > 1 ? "s" : ""}. View the clinical thread to reply.
                </p>
                <Link
                  href="/portal/messages"
                  className="text-[10px] font-bold text-gold hover:underline block pt-1"
                >
                  Go to messages →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
