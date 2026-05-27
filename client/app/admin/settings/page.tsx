"use client";

import { useState } from "react";
import { CLINIC } from "@/lib/constants";
import { Settings, Save, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"clinic" | "rules" | "billing">("clinic");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [clinicDetails, setClinicDetails] = useState({
    name: CLINIC.name,
    address: CLINIC.address,
    phone: CLINIC.phone,
    email: CLINIC.email,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setTimeout(() => {
      setLoading(false);
      setSuccess("Clinic configurations saved successfully.");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-serif text-2xl font-bold text-navy">System Settings</h1>
        <p className="text-gray-500 text-xs mt-1">Configure clinic operational rules, contact details, and payment limits</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500" /> {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6 text-xs font-semibold text-navy">
        <button
          onClick={() => { setActiveTab("clinic"); setSuccess(""); }}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === "clinic" ? "border-gold text-gold" : "border-transparent text-gray-400"
          }`}
        >
          Clinic Details
        </button>
        <button
          onClick={() => { setActiveTab("rules"); setSuccess(""); }}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === "rules" ? "border-gold text-gold" : "border-transparent text-gray-400"
          }`}
        >
          Scheduling Rules
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        
        {/* CLINIC DETAILS */}
        {activeTab === "clinic" && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Clinic Name</label>
                <input
                  type="text"
                  value={clinicDetails.name}
                  onChange={(e) => setClinicDetails({ ...clinicDetails, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Enquiry Phone</label>
                <input
                  type="text"
                  value={clinicDetails.phone}
                  onChange={(e) => setClinicDetails({ ...clinicDetails, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Enquiry Email</label>
                <input
                  type="email"
                  value={clinicDetails.email}
                  onChange={(e) => setClinicDetails({ ...clinicDetails, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-semibold text-navy">Postal Address</label>
                <input
                  type="text"
                  value={clinicDetails.address}
                  onChange={(e) => setClinicDetails({ ...clinicDetails, address: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-gold hover:bg-gold-dark text-navy font-bold py-2.5 px-6 rounded-lg text-xs shadow-md transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Clinic Details"}
            </button>
          </form>
        )}

        {/* RULES SETTINGS */}
        {activeTab === "rules" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSuccess("Scheduling rules saved successfully.");
            }}
            className="space-y-4 max-w-md"
          >
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-navy">
                <input type="checkbox" defaultChecked className="accent-gold h-4.5 w-4.5 rounded" />
                <div>
                  <span className="block">Require Manual Approval for Online Bookings</span>
                  <span className="block text-[10px] text-gray-400 font-normal">
                    Patient bookings remain in <em>pending</em> until approved on the Approvals page.
                  </span>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-navy">
                <input type="checkbox" defaultChecked className="accent-gold h-4.5 w-4.5 rounded" />
                <div>
                  <span className="block">Same-Day Booking Restriction</span>
                  <span className="block text-[10px] text-gray-400 font-normal">Prevent patients from scheduling online within 2 hours of slot.</span>
                </div>
              </label>
            </div>
            
            <button
              type="submit"
              className="bg-navy text-white font-bold py-2.5 px-6 rounded-lg text-xs shadow transition-colors"
            >
              Save Scheduling Rules
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
