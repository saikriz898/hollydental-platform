"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import { Search, UserPlus, FileText, ChevronRight, Eye, ClipboardList, Phone, Mail } from "lucide-react";

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = () => {
    setLoading(true);
    const path = search ? `/patients?search=${search}` : "/patients";
    apiRequest(path)
      .then((data) => setPatients(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">Patient Directory</h1>
          <p className="text-gray-500 text-xs mt-1">Review registered client profiles, invoice balances, and medical summaries</p>
        </div>
      </div>

      {/* Search & Action bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {loading ? (
        <div className="h-[200px] shimmer rounded-2xl" />
      ) : patients.length === 0 ? (
        <div className="border border-gray-200 rounded-2xl bg-white p-12 text-center space-y-3 max-w-md mx-auto">
          <ClipboardList className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-serif text-base font-semibold text-navy">No Patients Found</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            No patient profiles correspond to your current directory query parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-100 hover:border-gold rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                    {(p.firstName?.[0] || "") + (p.lastName?.[0] || "")}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-sm font-bold text-navy truncate group-hover:text-gold transition-colors">
                      {p.firstName} {p.lastName}
                    </h3>
                    <span className="text-[9px] uppercase tracking-wider bg-navy/5 text-navy font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Patient
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-gray-500 mb-6">
                  <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                    <a href={`tel:${p.phone}`} className="text-navy hover:text-gold transition-colors font-semibold truncate">
                      {p.phone || "—"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                    <a href={`mailto:${p.email}`} className="text-navy hover:text-gold transition-colors font-semibold truncate" title={p.email}>
                      {p.email || "—"}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Link
                  href={`/admin/patients/${p.id}`}
                  className="w-full text-center bg-navy hover:bg-gold text-white hover:text-navy font-bold py-2.5 rounded-lg text-xs transition-colors inline-flex items-center justify-center gap-1.5 focus:outline-none shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" /> View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
