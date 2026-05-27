"use client";

import { useLiveData } from "@/lib/useLiveData";
import { apiRequest } from "@/lib/api";
import { toast } from "@/lib/toast";
import { FileText, Calendar, Receipt, Download, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  totalAmount: string | number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  items: Array<{ description: string; quantity: number; price: number | string }>;
}

function normalizeInvoices(raw: any): Invoice[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.invoices)) return raw.invoices;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

export default function PatientInvoicesPage() {
  const {
    data: invoices = [],
    loading,
    refetch,
  } = useLiveData<Invoice[]>("/billing/invoices/my", {
    intervalMs: 30000,
    select: normalizeInvoices,
    initialData: [],
  });

  const handleDownloadPdf = async (id: string) => {
    try {
      const res = await apiRequest(`/billing/invoices/${id}/pdf`);
      const url: string | undefined = res?.url || res?.pdfUrl;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      throw new Error("No PDF URL");
    } catch {
      toast.warning(
        "PDF receipt is not available yet for this invoice. Please contact the clinic."
      );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">My Billing & Invoices</h1>
          <p className="text-gray-500 text-xs mt-1">
            Track treatment statements, view receipt histories, and download PDFs.
          </p>
        </div>
        <button
          onClick={refetch}
          className="text-xs font-semibold text-gold border border-gold/20 hover:bg-gold/5 px-4 py-2 rounded-lg flex items-center gap-1.5 focus:outline-none transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync
        </button>
      </div>

      {loading && invoices.length === 0 ? (
        <div className="h-[200px] shimmer rounded-2xl" />
      ) : invoices.length === 0 ? (
        <div className="border border-gray-100 rounded-2xl bg-white p-12 text-center space-y-4 max-w-md mx-auto">
          <Receipt className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-serif text-base font-semibold text-navy">No Billing Statements</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            You don't have any pending or past treatment statements logged. Any invoice raised by our office will be accessible here.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="border border-gray-100 bg-white rounded-2xl p-5 shadow-sm hover:border-gold transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-semibold text-navy text-xs">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        inv.status === "paid"
                          ? "bg-emerald-50 text-emerald-600"
                          : inv.status === "overdue"
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 flex gap-x-3 gap-y-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gold" /> Issued: {formatDate(inv.issueDate)}
                    </span>
                    {inv.status !== "paid" && (
                      <span className="flex items-center gap-1 font-semibold text-amber-700">
                        Due: {formatDate(inv.dueDate)}
                      </span>
                    )}
                  </div>
                  {/* Items brief */}
                  {inv.items && inv.items.length > 0 && (
                    <p className="text-gray-400 text-[10px] truncate max-w-sm mt-1">
                      Procedure: {inv.items.map((it) => it.description).join(", ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-gray-50 pt-3 md:pt-0 mt-2 md:mt-0 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
                    Total Due
                  </span>
                  <span className="font-serif text-lg font-bold text-navy">
                    &euro;{Number(inv.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => handleDownloadPdf(inv.id)}
                  className="bg-navy hover:bg-gray-800 text-white font-bold p-2.5 rounded-lg text-xs flex items-center gap-1.5 focus:outline-none transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
