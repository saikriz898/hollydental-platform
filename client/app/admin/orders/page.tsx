"use client";

import { useLiveData } from "@/lib/useLiveData";
import { apiRequest } from "@/lib/api";
import { toast } from "@/lib/toast";
import { PackageCheck, RefreshCw, X, Check, Truck, CreditCard } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState, useMemo } from "react";

interface Order {
  id: string;
  productName: string;
  quantity: number;
  totalAmount: string | number;
  paymentMethod: "cash" | "upi";
  upiReference?: string | null;
  status: "pending" | "paid" | "ready" | "completed" | "cancelled";
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt?: string | null;
  fulfilledAt?: string | null;
  cancelledAt?: string | null;
}

function normalizeOrders(raw: any): Order[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.orders)) return raw.orders;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

const TABS: { label: string; value: string }[] = [
  { label: "All Orders", value: "" },
  { label: "Pending Review", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Ready for Pickup", value: "ready" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState("");
  const [actingId, setActingId] = useState<string | null>(null);

  const { data: orders = [], loading, refetch } = useLiveData<Order[]>("/orders", {
    intervalMs: 15000,
    initialData: [],
    select: normalizeOrders,
  });

  const filteredOrders = useMemo(() => {
    if (!activeTab) return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const handleUpdateStatus = async (id: string, status: Order["status"]) => {
    setActingId(id);
    try {
      await apiRequest(`/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Order marked as ${status}.`);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update order status.");
    } finally {
      setActingId(null);
    }
  };

  const handleCancelOrder = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this order? This will restock the product inventory.")) return;
    setActingId(id);
    try {
      await apiRequest(`/orders/${id}`, { method: "DELETE" });
      toast.success("Order cancelled and inventory restocked.");
      refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel order.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-gold" /> Product Orders Queue
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Manage customer product purchases, verify UPI deposits, and process ready-to-pickup orders.
          </p>
        </div>
        <button
          onClick={refetch}
          className="text-xs font-semibold text-gold border border-gold/20 hover:bg-gold/5 px-4 py-2 rounded-lg flex items-center gap-1.5 focus:outline-none transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync
        </button>
      </div>

      {/* Tabs / Filters */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors focus:outline-none ${
              activeTab === tab.value
                ? "bg-navy text-white border-navy font-semibold"
                : "border-gray-200 text-navy hover:border-gold hover:text-gold"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {loading && orders.length === 0 ? (
        <div className="h-[250px] shimmer rounded-2xl" />
      ) : filteredOrders.length === 0 ? (
        <div className="border border-gray-200 rounded-2xl bg-white p-12 text-center space-y-3 max-w-md mx-auto">
          <PackageCheck className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-serif text-base font-semibold text-navy">No Orders Found</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            No orders match the current status selection.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[800px]">
              <thead className="bg-navy text-white border-b border-gray-200 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Placed Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Product Info</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((o) => {
                  const isBusy = actingId === o.id;
                  return (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors align-top">
                      {/* Placed Date */}
                      <td className="p-4 whitespace-nowrap text-gray-500">
                        {o.createdAt ? formatDate(o.createdAt) : "—"}
                      </td>

                      {/* Customer Details */}
                      <td className="p-4">
                        <span className="block font-bold text-navy">{o.customerName || "—"}</span>
                        {o.customerPhone && (
                          <span className="block text-[10px] text-gray-400 mt-0.5">Phone: {o.customerPhone}</span>
                        )}
                        {o.customerEmail && (
                          <span className="block text-[10px] text-gray-400">Email: {o.customerEmail}</span>
                        )}
                        {o.notes && (
                          <span className="block bg-amber-50 text-amber-800 text-[9px] p-1.5 rounded border border-amber-100/50 mt-1.5 italic max-w-[220px] whitespace-pre-wrap">
                            Note: {o.notes}
                          </span>
                        )}
                      </td>

                      {/* Product Info */}
                      <td className="p-4">
                        <span className="block font-semibold text-navy">{o.productName}</span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">Quantity: {o.quantity}</span>
                      </td>

                      {/* Payment Method */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-navy/5 text-navy font-bold px-2 py-0.5 rounded uppercase tracking-wider text-[9px]">
                          {o.paymentMethod === "upi" ? (
                            <>
                              <CreditCard className="w-3 h-3 text-gold" /> UPI
                            </>
                          ) : (
                            "Cash on Pickup"
                          )}
                        </span>
                        {o.upiReference && (
                          <span className="block text-[10px] font-mono text-gray-500 mt-1 break-all bg-gray-50 p-1 rounded border border-gray-100">
                            UPI Ref: {o.upiReference}
                          </span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="p-4">
                        <span className="font-serif font-bold text-navy text-sm">
                          €{Number(o.totalAmount || 0).toFixed(2)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            o.status === "completed"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : o.status === "pending"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : o.status === "ready"
                              ? "bg-blue-50 text-blue-600 border border-blue-100"
                              : o.status === "paid"
                              ? "bg-teal-50 text-teal-600 border border-teal-100"
                              : "bg-red-50 text-red-500 border border-red-100"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {o.status === "pending" && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleUpdateStatus(o.id, "paid")}
                              className="bg-teal-50 hover:bg-teal-100 text-teal-700 px-2.5 py-1 rounded text-[10px] font-semibold flex items-center gap-0.5 border border-teal-200 transition-colors disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" /> Mark Paid
                            </button>
                          )}
                          {(o.status === "pending" || o.status === "paid") && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleUpdateStatus(o.id, "ready")}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-[10px] font-semibold flex items-center gap-0.5 border border-blue-200 transition-colors disabled:opacity-50"
                            >
                              <Truck className="w-3 h-3" /> Mark Ready
                            </button>
                          )}
                          {o.status === "ready" && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleUpdateStatus(o.id, "completed")}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded text-[10px] font-semibold flex items-center gap-0.5 border border-emerald-200 transition-colors disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" /> Collected
                            </button>
                          )}
                          {o.status !== "completed" && o.status !== "cancelled" && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleCancelOrder(o.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1 rounded text-[10px] font-semibold flex items-center gap-0.5 border border-red-200 transition-colors disabled:opacity-50"
                            >
                              <X className="w-3 h-3" /> Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
