"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Bell,
  CalendarCheck,
  ClipboardList,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { useLiveData } from "@/lib/useLiveData";
import PushToggle from "@/components/common/PushToggle";

interface NotificationItem {
  id: string;
  type: "appointment" | "prescription" | "message";
  title: string;
  body: string;
  href: string;
  timestamp: string;
  read: boolean;
}

const ICONS: Record<NotificationItem["type"], React.ReactNode> = {
  appointment: <CalendarCheck className="w-4 h-4" />,
  prescription: <ClipboardList className="w-4 h-4" />,
  message: <MessageSquare className="w-4 h-4" />,
};

function formatRelative(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  if (Number.isNaN(diff) || diff < 0) return "just now";
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(ts).toLocaleDateString();
}

export default function PortalNotificationsPage() {
  const { data, loading, error, refetch } = useLiveData<NotificationItem[]>(
    "/notifications/me",
    { intervalMs: 30000, initialData: [] }
  );

  const items = useMemo(() => data ?? [], [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy flex items-center gap-2">
            <Bell className="w-5 h-5 text-gold" /> Notifications
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Real-time updates on your appointments, prescriptions, and messages.
          </p>
        </div>
        <button
          onClick={refetch}
          className="border border-gray-200 hover:border-gold hover:text-gold text-navy font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <PushToggle variant="card" />

      {loading && items.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 shimmer rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="border border-red-100 bg-red-50/40 rounded-2xl p-6 text-xs text-red-600">
          We couldn&apos;t load your notifications. Please try again in a moment.
        </div>
      ) : items.length === 0 ? (
        <div className="border border-gray-100 rounded-2xl bg-white p-12 text-center space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold mx-auto flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-navy">
            You&apos;re all caught up
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            New activity from the clinic will land here as it happens.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href}
                className="group block border border-gray-100 hover:border-gold rounded-2xl bg-white p-4 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      n.type === "appointment"
                        ? "bg-emerald-50 text-emerald-600"
                        : n.type === "prescription"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-navy/5 text-navy"
                    }`}
                  >
                    {ICONS[n.type]}
                  </span>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-sm font-bold text-navy group-hover:text-gold transition-colors">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {n.body}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                      {formatRelative(n.timestamp)}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
