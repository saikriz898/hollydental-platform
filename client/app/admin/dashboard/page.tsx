"use client";

import { useMemo } from "react";
import { useLiveData } from "@/lib/useLiveData";
import {
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  FileText,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  Tooltip,
} from "recharts";

interface ActivityEvent {
  id: string;
  type: "appointment" | "invoice" | "patient" | string;
  text: string;
  at: string;
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function iconFor(type: string) {
  if (type === "invoice") return FileText;
  if (type === "patient") return UserPlus;
  return Calendar;
}

export default function AdminDashboardPage() {
  // Live overview — refetches every 30s and on focus.
  const {
    data: stats,
    loading,
    error,
  } = useLiveData<any>("/analytics/overview", {
    intervalMs: 30000,
  });

  // Live activity feed — faster cadence so the dashboard truly feels live.
  const { data: activityResp } = useLiveData<{ events: ActivityEvent[] }>(
    "/analytics/activity?limit=8",
    {
      intervalMs: 15000,
      initialData: { events: [] },
    }
  );

  const events = activityResp?.events ?? [];

  const totalAppointmentsToday = Number(stats?.totalAppointmentsToday ?? 0);
  const activePatientsCount = Number(stats?.activePatientsCount ?? 0);
  const monthlyRevenue = Number(stats?.monthlyRevenue ?? 0);
  const pendingInvoices = Number(stats?.pendingInvoices ?? 0);
  const revenueHistory = Array.isArray(stats?.revenueHistory)
    ? stats.revenueHistory
    : [];

  const COLORS = useMemo(
    () => ["#0A1628", "#C9A96E", "#059669", "#DC2626"],
    []
  );

  const donutData = [
    { name: "General", value: 450 },
    { name: "Cosmetic", value: 300 },
    { name: "Advanced", value: 150 },
    { name: "Ortho", value: 100 },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
            Welcome back, Dr. Roghay
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Here is today's overview at Hollyhill Shopping Centre surgery.
          </p>
        </div>
        <div className="text-xs font-semibold text-navy bg-navy/5 px-4 py-2 rounded-lg">
          Today:{" "}
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>
            {(error as any)?.message || "Failed to load overview statistics."}{" "}
            (Showing cached or fallback data.)
          </span>
        </div>
      )}

      {loading && !stats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 shimmer rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <>
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Today's Visits
                </span>
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-navy">
                  {totalAppointmentsToday}
                </span>
                <span className="text-emerald-500 text-[10px] font-bold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +12%
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Active Patients
                </span>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-navy">
                  {activePatientsCount}
                </span>
                <span className="text-emerald-500 text-[10px] font-bold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +4%
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Monthly Revenue
                </span>
                <div className="w-9 h-9 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-navy">
                  &euro;{monthlyRevenue.toLocaleString()}
                </span>
                <span className="text-emerald-500 text-[10px] font-bold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +8%
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Pending Invoices
                </span>
                <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-navy">
                  &euro;{pendingInvoices.toLocaleString()}
                </span>
                <span className="text-red-500 text-[10px] font-bold flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" /> -2%
                </span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 lg:col-span-2">
              <h3 className="font-serif text-sm font-bold text-navy">
                Monthly Revenue Flow (&euro;)
              </h3>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueHistory}>
                    <XAxis dataKey="name" fontSize={10} stroke="#9CA3AF" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#C9A96E"
                      strokeWidth={3}
                      dot={{ fill: "#0A1628" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-serif text-sm font-bold text-navy">
                Visits by Category
              </h3>
              <div className="h-[200px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      fill="#8884d8"
                    >
                      {donutData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around text-[10px] font-bold text-navy">
                {donutData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                    />
                    <span>{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed & Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-bold text-navy">
                  Live Clinical Events
                </h3>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="space-y-3">
                {events.length === 0 ? (
                  <div className="text-xs text-gray-400 py-6 text-center">
                    <Activity className="w-5 h-5 mx-auto mb-2 text-gray-300" />
                    No recent activity yet. Bookings, payments and new patients
                    will surface here in real time.
                  </div>
                ) : (
                  events.map((evt) => {
                    const Icon = iconFor(evt.type);
                    return (
                      <div
                        key={evt.id}
                        className="flex items-center gap-3 border-b border-gray-50 pb-2 last:border-none last:pb-0"
                      >
                        <div className="w-8 h-8 rounded bg-gray-50 text-gold flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-xs text-navy font-medium truncate">
                          {evt.text}
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {formatRelative(evt.at)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-serif text-sm font-bold text-navy">Task Alerts</h3>
              <ul className="space-y-2 text-xs text-gray-600 list-disc pl-4">
                <li>Check clinical chart backups on Neon</li>
                <li>Approve pending invoice generated by walk-in</li>
                <li>Write SEO blog draft using AI Generator</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
