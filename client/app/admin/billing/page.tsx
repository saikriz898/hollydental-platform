"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useLiveData } from "@/lib/useLiveData";
import { toast } from "@/lib/toast";
import { Plus, RefreshCw } from "lucide-react";

interface PatientLite {
  id: string;
  firstName: string;
  lastName: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  totalAmount: string | number;
  status: "paid" | "pending" | "overdue" | "cancelled";
}

function normalizePatients(raw: any): PatientLite[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.patients)) return raw.patients;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}
function normalizeInvoices(raw: any): Invoice[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.invoices)) return raw.invoices;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

export default function AdminBillingPage() {
  const { data: patients = [] } = useLiveData<PatientLite[]>("/patients", {
    intervalMs: 0,
    select: normalizePatients,
    initialData: [],
  });

  const {
    data: invoices = [],
    loading,
    refetch,
  } = useLiveData<Invoice[]>("/billing/invoices", {
    intervalMs: 30000,
    select: normalizeInvoices,
    initialData: [],
  });

  const [showBuilder, setShowBuilder] = useState(false);
  const [builderLoading, setBuilderLoading] = useState(false);

  const [patientId, setPatientId] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemCost, setItemCost] = useState("");

  useEffect(() => {
    if (!patientId && patients.length > 0) {
      setPatientId(patients[0].id);
    }
  }, [patients, patientId]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast.warning("Please select a patient first.");
      return;
    }
    setBuilderLoading(true);

    try {
      const cost = parseFloat(itemCost);
      if (isNaN(cost) || cost <= 0) {
        toast.warning("Please enter a valid cost.");
        return;
      }
      await apiRequest("/billing/invoices", {
        method: "POST",
        body: JSON.stringify({
          patientId,
          items: [{ description: itemDesc, quantity: 1, price: cost }],
          subtotal: cost,
          vatAmount: 0,
          totalAmount: cost,
        }),
      });
      setShowBuilder(false);
      setItemDesc("");
      setItemCost("");
      refetch();
      toast.success("Invoice generated.");
    } catch (error: any) {
      toast.error(`Failed to create invoice: ${error?.message || "Please try again."}`);
    } finally {
      setBuilderLoading(false);
    }
  };

  const handleDownloadPdf = async (id: string) => {
    try {
      const res = await apiRequest(`/billing/invoices/${id}/pdf`);
      const url: string | undefined = res?.url || res?.pdfUrl;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      throw new Error("No PDF URL returned");
    } catch {
      toast.warning("PDF receipt is not available yet for this invoice.");
    }
  };

  const totalCollected = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">Billing & Invoices</h1>
          <p className="text-gray-500 text-xs mt-1">
            Review revenue flow, process settlements, and generate invoices.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setShowBuilder(true)}
            disabled={patients.length === 0}
            className="bg-gold hover:bg-gold-dark text-navy font-bold px-4 py-2 rounded-lg text-xs shadow flex items-center gap-1.5 focus:outline-none disabled:opacity-50 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
          <button
            onClick={refetch}
            className="border border-navy text-navy font-semibold px-4 py-2 rounded-lg text-xs hover:bg-gray-50 focus:outline-none flex items-center gap-1.5 whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
            Total Collected
          </span>
          <span className="text-3xl font-serif font-bold text-navy block mt-1.5">
            &euro;{totalCollected.toLocaleString()}
          </span>
        </div>
      </div>

      {loading && invoices.length === 0 ? (
        <div className="h-[200px] shimmer rounded-2xl" />
      ) : invoices.length === 0 ? (
        <div className="border border-gray-200 rounded-2xl bg-white p-12 text-center space-y-3 max-w-md mx-auto">
          <h3 className="font-serif text-base font-semibold text-navy">No Invoices</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            No invoices have been generated yet.
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-navy text-white">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-mono font-semibold text-navy">{inv.invoiceNumber}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(inv.issueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold text-navy">
                    &euro;{Number(inv.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        inv.status === "paid"
                          ? "bg-emerald-50 text-emerald-600"
                          : inv.status === "overdue"
                          ? "bg-red-100 text-red-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-semibold">
                    <button
                      onClick={() => handleDownloadPdf(inv.id)}
                      className="text-navy hover:text-gold transition-colors focus:outline-none"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showBuilder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-end">
          <div className="bg-white h-screen w-full max-w-[460px] p-6 space-y-6 shadow-2xl relative flex flex-col justify-between animate-fade-up">
            <button
              onClick={() => setShowBuilder(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-navy text-lg font-bold"
            >
              &times;
            </button>

            <form onSubmit={handleCreateInvoice} className="space-y-4 flex-1 mt-6">
              <div className="border-b border-gray-200 pb-3">
                <h4 className="font-serif text-lg font-bold text-navy">New Clinical Invoice</h4>
                <p className="text-gray-500 text-[10px] mt-0.5">
                  Generate a billing record for a procedure.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Patient</label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
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
                  <label className="text-[10px] font-semibold text-navy">
                    Treatment Description
                  </label>
                  <input
                    type="text"
                    required
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    placeholder="e.g. Tooth restoration filling"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Cost Fee (&euro;)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                    placeholder="e.g. 150.00"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={builderLoading}
                className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-2.5 rounded-lg text-xs shadow-md transition-colors disabled:opacity-50 mt-4"
              >
                {builderLoading ? "Generating…" : "Generate and Send Invoice"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
