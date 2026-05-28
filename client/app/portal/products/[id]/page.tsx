"use client";

import { useEffect, useState, use } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Star,
  Shield,
  Clock,
  ChevronRight,
  Minus,
  Plus,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  priceTo?: string | null;
  imageUrl?: string | null;
  stockCount: number;
  category?: "procedure" | "extra" | string;
  displayOrder?: number;
}

function formatPrice(price: string, priceTo?: string | null) {
  const lower = parseFloat(price).toFixed(2);
  if (priceTo && priceTo !== "" && priceTo !== "0.00") {
    return `€${lower} – €${parseFloat(priceTo).toFixed(2)}`;
  }
  return `€${lower}`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Order state
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/products/${id}`);
      setProduct(data);
    } catch (err: any) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!product) return;
    setOrdering(true);
    try {
      const res = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          quantity,
          paymentMethod: "cash",
          notes: notes.trim() || undefined,
        }),
      });
      setOrderSuccess(true);
      setOrderId(res?.order?.id || null);
      toast.success("Order placed! The clinic will confirm shortly.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to place order. Please try again.");
    } finally {
      setOrdering(false);
    }
  };

  const isProcedure = product?.category === "procedure";
  const isOutOfStock = !isProcedure && (product?.stockCount ?? 0) === 0;
  const isLowStock = !isProcedure && (product?.stockCount ?? 0) > 0 && (product?.stockCount ?? 0) <= 5;
  const unitPrice = parseFloat(product?.price || "0");
  const totalPrice = (unitPrice * quantity).toFixed(2);

  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-8 shimmer rounded-xl w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square shimmer rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 shimmer rounded-xl w-3/4" />
            <div className="h-6 shimmer rounded-xl w-1/3" />
            <div className="h-24 shimmer rounded-xl" />
            <div className="h-12 shimmer rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-gray-200" />
        <h2 className="font-serif text-xl font-bold text-navy">Product Not Found</h2>
        <p className="text-gray-400 text-sm">This product may have been removed.</p>
        <Link href="/portal/products" className="bg-gold text-navy font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gold-dark transition-colors">
          Back to Products
        </Link>
      </div>
    );
  }

  // ─── Order Success State ───
  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center max-w-md mx-auto">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <span className="absolute -top-2 -right-2 text-3xl">🎉</span>
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-navy">Order Placed!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your order for <strong>{product.name}</strong> has been received.
            The clinic will prepare it and confirm pickup details.
          </p>
        </div>

        {/* Order summary card */}
        <div className="w-full bg-white border border-gray-100 rounded-2xl p-5 text-left space-y-3 shadow-sm">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Order Summary</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-navy text-sm truncate">{product.name}</p>
              <p className="text-xs text-gray-400">Qty: {quantity}</p>
            </div>
            <p className="font-serif font-bold text-navy text-base shrink-0">€{totalPrice}</p>
          </div>
          <div className="border-t border-gray-50 pt-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="flex items-center gap-1 font-bold text-navy">
                <Banknote className="w-3.5 h-3.5 text-emerald-500" /> Cash on pickup
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-bold text-amber-600">Pending confirmation</span>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <p className="text-xs text-gray-400 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">
            <Shield className="w-3.5 h-3.5 inline-block mr-1 text-emerald-500" />
            Pay <strong>€{totalPrice}</strong> in cash when you pick up at the clinic. No payment is collected online.
          </p>
          <Link
            href="/portal/orders"
            className="w-full bg-navy text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Package className="w-4 h-4" /> View My Orders
          </Link>
          <Link
            href="/portal/products"
            className="w-full border border-gray-200 text-navy font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/portal/products" className="hover:text-gold transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Products
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-navy font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Left — Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <Package className="w-16 h-16 text-gray-200" />
                <p className="text-xs text-gray-300">No image available</p>
              </div>
            )}

            {/* Category badge */}
            <div className="absolute top-4 left-4">
              {isProcedure ? (
                <span className="bg-navy text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Chairside Procedure
                </span>
              ) : isOutOfStock ? (
                <span className="bg-red-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="bg-amber-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Only {product.stockCount} left
                </span>
              ) : (
                <span className="bg-emerald-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  In Stock
                </span>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, label: "Clinic Approved" },
              { icon: Star, label: "Quality Assured" },
              { icon: Clock, label: "Ready Pickup" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                <Icon className="w-4 h-4 text-gold mx-auto mb-1" />
                <p className="text-[9px] font-bold text-navy uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Product Info + Order */}
        <div className="flex flex-col gap-5">
          {/* Product name + price */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">
              {isProcedure ? "Dental Procedure" : "Oral Care Product"}
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-gold">
                {formatPrice(product.price, product.priceTo)}
              </span>
              {isProcedure && (
                <span className="text-xs text-gray-400">per session</span>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
              <p className="text-[13px] text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Order section */}
          {isProcedure ? (
            /* ─── Procedure: Book consultation CTA ─── */
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
                <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-navy" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy">Book Appointment</p>
                  <p className="text-[10px] text-gray-400">This is a chairside treatment performed at the clinic</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                To schedule this procedure, please contact the clinic directly or use the appointment booking system. Our team will confirm pricing and prepare your treatment plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/portal/booking"
                  className="flex-1 bg-navy text-white font-bold py-3 rounded-xl text-sm text-center hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  Book Appointment <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/portal/messages"
                  className="flex-1 border border-gray-200 text-navy font-semibold py-3 rounded-xl text-sm text-center hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  Message the Clinic
                </Link>
              </div>
            </div>
          ) : (
            /* ─── Product: Place Cash Order ─── */
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy">Cash on Pickup</p>
                  <p className="text-[10px] text-gray-400">Pay when you collect from the clinic</p>
                </div>
              </div>

              {isOutOfStock ? (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center space-y-1">
                  <AlertCircle className="w-5 h-5 text-red-400 mx-auto" />
                  <p className="text-sm font-bold text-red-600">Out of Stock</p>
                  <p className="text-xs text-red-400">Contact the clinic to request this item.</p>
                </div>
              ) : (
                <>
                  {/* Quantity selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-navy hover:border-navy hover:bg-navy/5 transition-colors disabled:opacity-40"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-serif font-bold text-navy text-lg min-w-[32px] text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                        disabled={quantity >= product.stockCount}
                        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-navy hover:border-navy hover:bg-navy/5 transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-gray-400 font-semibold ml-1">
                        {product.stockCount} available
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider">
                      Notes for clinic <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Allergies, special requests, preferred pickup time…"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-navy resize-none focus:outline-none focus:border-gold focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Order total */}
                  <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between border border-gray-100">
                    <span className="text-xs text-gray-500 font-semibold">Order Total</span>
                    <span className="font-serif font-bold text-navy text-xl">€{totalPrice}</span>
                  </div>

                  {/* Cash info notice */}
                  <div className="flex items-start gap-2 text-[10px] text-gray-400 bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
                    <Banknote className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-emerald-700">Cash only</strong> — No online payment needed. Bring <strong className="text-emerald-700">€{totalPrice}</strong> when you collect from the clinic. UPI payment coming soon.
                    </p>
                  </div>

                  {/* Place Order button */}
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={ordering || isOutOfStock}
                    className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3.5 rounded-xl text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {ordering ? (
                      <>
                        <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                        Placing Order…
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Place Order — €{totalPrice}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Link to orders */}
          <Link
            href="/portal/orders"
            className="text-center text-xs text-gray-400 hover:text-gold transition-colors flex items-center justify-center gap-1"
          >
            <Package className="w-3.5 h-3.5" /> View your existing orders
          </Link>
        </div>
      </div>
    </div>
  );
}
