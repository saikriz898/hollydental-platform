"use client";

import { useMemo, useState } from "react";
import { useLiveData } from "@/lib/useLiveData";
import {
  Activity as ActivityIcon,
  Search,
  RefreshCw,
  ShieldAlert,
  Filter,
  Globe,
} from "lucide-react";

interface AuditEntry {
  id: string;
  actorId: string | null;
  actorRole: "admin" | "patient" | "system" | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, any> | null;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

function normalize(raw: any): AuditEntry[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.logs)) return raw.logs;
  return [];
}

const QUICK_FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Logins", value: "auth.login" },
  { label: "Password resets", value: "admin.user.password.reset" },
  { label: "Failed logins", value: "auth.login.failure" },
  { label: "Appointments", value: "appointment." },
  { label: "Messages", value: "message." },
];

export default function AdminActivityLogPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const path = useMemo(() => {
    const params = new URLSearchParams({ limit: "200" });
    if (actionFilter) params.set("action", actionFilter);
    if (search.trim()) params.set("search", search.trim());
    return `/admin/audit-logs?${params.toString()}`;
  }, [actionFilter, search]);

  const { data: rows = [], loading, error, refetch } = useLiveData<AuditEntry[]>(path, {
    intervalMs: 15000,
    select: normalize,
    initialData: [],
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <header className="border-b border-gray-200 pb-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded-full">
            <ActivityIcon className="w-3 h-3" /> Audit Trail
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
            Activity log
          </h1>
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
            Security-sensitive events across the clinic — sign-ins, password
            changes, message and appointment activity. Refreshes every 15s.
          </p>
        </div>
        <button
          type="button"
          onClick={refetch}
          className="border border-gray-200 hover:border-gold hover:text-gold text-navy font-semibold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </header>

      <div className="bg-white border border-gray-100 shadow-card rounded-2xl p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, target type or note…"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-navy placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-widest">
              <Filter className="w-3 h-3" /> Quick filter
            </span>
            {QUICK_FILTERS.map((qf) => (
              <button
                key={qf.label}
                onClick={() => setActionFilter(qf.value)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                  actionFilter === qf.value
                    ? "bg-navy text-white border-navy"
                    : "border-gray-200 text-navy hover:border-gold hover:text-gold"
                }`}
              >
                {qf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50/60 text-red-700 px-4 py-3 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Failed to load audit logs.</span>
        </div>
      )}

      <div className="bg-white border border-gray-100 shadow-card rounded-2xl overflow-hidden max-h-[600px] overflow-y-auto">
        {loading && rows.length === 0 ? (
          <div className="p-10 text-center text-xs text-gray-400">Loading audit log…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-xs text-gray-400">
            No activity matches the current filters.
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-off-white border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3 bg-off-white">When</th>
                <th className="text-left px-4 py-3 bg-off-white">Actor</th>
                <th className="text-left px-4 py-3 bg-off-white">Action</th>
                <th className="text-left px-4 py-3 bg-off-white">Target</th>
                <th className="text-left px-4 py-3 bg-off-white">Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-50 hover:bg-gold/5 transition-colors align-top"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                    {new Date(r.createdAt).toLocaleString([], {
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="block text-navy font-semibold capitalize">
                      {r.actorRole || "system"}
                    </span>
                    <span className="block text-[10px] text-gray-400 font-mono break-all">
                      {r.actorId ? r.actorId.substring(0, 8) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-navy">
                      {r.action}
                    </span>
                    {r.metadata && Object.keys(r.metadata).length > 0 && (
                      <details className="text-[10px] text-gray-500 mt-1">
                        <summary className="cursor-pointer hover:text-navy">
                          Details
                        </summary>
                        <pre className="bg-gray-50 border border-gray-100 rounded-lg p-2 mt-1 whitespace-pre-wrap break-all">
                          {JSON.stringify(r.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    {r.targetType ? (
                      <>
                        <span className="block text-navy font-semibold capitalize">
                          {r.targetType}
                        </span>
                        <span className="block text-[10px] text-gray-400 font-mono break-all">
                          {r.targetId ? r.targetId.substring(0, 8) : "—"}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Globe className="w-3 h-3 text-gold" />
                      {r.ip || "—"}
                    </span>
                    {r.userAgent && (
                      <span className="block text-[10px] text-gray-400 mt-0.5 truncate max-w-[260px]">
                        {r.userAgent}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
