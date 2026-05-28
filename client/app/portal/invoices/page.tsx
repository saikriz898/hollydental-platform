"use client";

import { useState } from "react";
import { useLiveData } from "@/lib/useLiveData";
import { apiRequest } from "@/lib/api";
import { toast } from "@/lib/toast";
import {
  FileText,
  Calendar,
  Receipt,
  Download,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number | string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  totalAmount: string | number;
  subtotal?: string | number;
  vatAmount?: string | number;
  paidAt?: string | null;
  status: "paid" | "pending" | "overdue" | "cancelled" | string;
  items: InvoiceItem[];
}

function normalizeInvoices(raw: any): Invoice[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.invoices)) return raw.invoices;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

function statusStyles(status: string) {
  if (status === "paid")
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (status === "overdue")
    return "bg-red-50 text-red-700 border border-red-200";
  if (status === "cancelled")
    return "bg-gray-50 text-gray-500 border border-gray-200";
  return "bg-amber-50 text-amber-700 border border-amber-200";
}

export default function PatientInvoicesPage() {
  const {
    data: invoices = [],
    loading,
    refetch,
  } = useLiveData<Invoice[]>("/billing/invoices/my", {
    intervalMs: 20000,
    select: normalizeInvoices,
    initialData: [],
  });

  const [expanded, setExpanded] = useState<string | null>(null);

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
        "PDF receipt isn't ready yet for this invoice. Please contact the clinic."
      );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <header className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-navy">
            My billing & invoices
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Track statements, see line-item breakdowns, and download PDF
            receipts. Updates live.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
          <button
            onClick={refetch}
            className="text-xs font-semibold text-gold border border-gold/20 hover:bg-gold/5 px-4 py-2 rounded-lg flex items-center gap-1.5 focus:outline-none transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Sync
          </button>
        </div>
      </header>

      {loading && invoices.length === 0 ? (
        <div className="h-[200px] shimmer rounded-2xl" />
      ) : invoices.length === 0 ? (
        <div className="border border-gray-100 rounded-2xl bg-white p-12 text-center space-y-4 max-w-md mx-auto">
          <Receipt className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-sans text-base font-bold text-navy">
            No billing statements
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            You don&apos;t have any pending or past statements logged. Anything
            raised by our office will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-4xl">
          {invoices.map((inv) => {
            const isOpen = expanded === inv.id;
            const total = Number(inv.totalAmount || 0);
            const subtotal = Number(inv.subtotal || total);
            const vat = Number(inv.vatAmount || 0);

            return (
              <div
                key={inv.id}
                className="border border-gray-100 bg-white rounded-2xl shadow-sm hover:border-gold transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : inv.id)}
                  className="w-full p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-semibold text-navy text-xs">
                          {inv.invoiceNumber}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusStyles(
                            inv.status
                          )}`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 flex gap-x-3 gap-y-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gold" /> Issued{" "}
                          {formatDate(inv.issueDate)}
                        </span>
                        {inv.status !== "paid" && inv.dueDate && (
                          <span className="flex items-center gap-1 font-semibold text-amber-700">
                            Due {formatDate(inv.dueDate)}
                          </span>
                        )}
                        {inv.status === "paid" && inv.paidAt && (
                          <span className="flex items-center gap-1 font-semibold text-emerald-700">
                            Paid {formatDate(inv.paidAt)}
                          </span>
                        )}
                      </div>
                      {inv.items?.length > 0 && (
                        <p className="text-gray-400 text-[11px] truncate max-w-md">
                          {inv.items.map((it) => it.description).join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
                        Total
                      </span>
                      <span className="font-sans text-lg font-bold text-navy">
                        €{total.toFixed(2)}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isOpen ? "rotate-180 text-gold" : ""
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50/60 p-5 space-y-4 animate-fade-up">
                    <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-navy uppercase tracking-wider font-bold text-[10px]">
                          <tr>
                            <th className="p-3">Description</th>
                            <th className="p-3 text-center">Qty</th>
                            <th className="p-3 text-right">Unit price</th>
                            <th className="p-3 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(inv.items || []).map((it, i) => {
                            const price = Number(it.price || 0);
                            const qty = Number(it.quantity || 1);
                            return (
                              <tr key={i} className="text-navy">
                                <td className="p-3 font-medium">
                                  {it.description}
                                </td>
                                <td className="p-3 text-center text-gray-500">
                                  {qty}
                                </td>
                                <td className="p-3 text-right text-gray-500">
                                  €{price.toFixed(2)}
                                </td>
                                <td className="p-3 text-right font-bold">
                                  €{(price * qty).toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="ml-auto max-w-xs space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>€{subtotal.toFixed(2)}</span>
                      </div>
                      {vat > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>VAT</span>
                          <span>€{vat.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-gray-200 pt-1.5 font-bold text-navy">
                        <span>Total</span>
                        <span>€{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDownloadPdf(inv.id)}
                        className="bg-navy hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 focus:outline-none transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
