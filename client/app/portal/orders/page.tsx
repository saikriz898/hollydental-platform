"use client";

import { useLiveData } from "@/lib/useLiveData";
import { apiRequest } from "@/lib/api";
import { toast } from "@/lib/toast";
import { PackageCheck, RefreshCw, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Order {
  id: string;
  productName: string;
  quantity: number;
  totalAmount: string | number;
  status: string;
  createdAt?: string;
}

export default function PatientOrdersPage() {
  const { data: orders = [], loading, refetch } = useLiveData<Order[]>(
    "/orders/my",
    {
      intervalMs: 30000,
      initialData: [],
    }
  );

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await apiRequest(`/orders/${id}`, { method: "DELETE" });
      toast.success("Order cancelled.");
      refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel order.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">My Orders</h1>
          <p className="text-gray-500 text-xs mt-1">Track product orders and pickup status.</p>
        </div>
        <button
          onClick={refetch}
          className="text-xs font-semibold text-gold border border-gold/20 hover:bg-gold/5 px-4 py-2 rounded-lg flex items-center gap-1.5 focus:outline-none transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="h-[200px] shimmer rounded-2xl" />
      ) : orders.length === 0 ? (
        <div className="border border-gray-100 rounded-2xl bg-white p-12 text-center space-y-4 max-w-md mx-auto">
          <PackageCheck className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-serif text-base font-semibold text-navy">No Orders</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            You haven't placed any product orders yet. Browse oral care products to place an order.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {orders.map((o) => (
            <div
              key={o.id}
              className="border border-gray-100 bg-white rounded-2xl p-5 shadow-sm hover:border-gold transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center shrink-0 mt-0.5">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-navy text-sm truncate">{o.productName}</span>
                    <span className="text-[11px] text-gray-400">×{o.quantity}</span>
                    <span className="text-[10px] text-gray-400 ml-2">{o.createdAt ? formatDate(o.createdAt) : ""}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Status: <strong className="capitalize">{o.status}</strong></div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total</div>
                  <div className="font-serif font-bold text-navy">€{Number(o.totalAmount || 0).toFixed(2)}</div>
                </div>
                {o.status === "pending" && (
                  <button
                    onClick={() => handleCancel(o.id)}
                    className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-100"
                  >
                    <X className="w-3.5 h-3.5 inline-block mr-1" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
