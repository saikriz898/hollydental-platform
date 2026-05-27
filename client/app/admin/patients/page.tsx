"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import { Search, UserPlus, FileText, ChevronRight, Eye, ClipboardList } from "lucide-react";

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
        <div className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-navy text-white">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-navy flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px]">
                      {p.firstName[0]}
                    </div>
                    <span>{p.firstName} {p.lastName}</span>
                  </td>
                  <td className="p-4 text-gray-600">{p.phone}</td>
                  <td className="p-4 text-gray-500">{p.email}</td>
                  <td className="p-4 text-right space-x-3 font-semibold">
                    <Link
                      href={`/admin/patients/${p.id}`}
                      className="text-navy hover:text-gold transition-colors inline-flex items-center gap-1 focus:outline-none"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
