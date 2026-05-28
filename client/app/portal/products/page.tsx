"use client";

import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import {
  ShoppingBag,
  Search,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Package,
} from "lucide-react";
import { CLINIC } from "@/lib/constants";
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
}

function formatPrice(price: string, priceTo?: string | null) {
  const lower = parseFloat(price).toFixed(2);
  if (priceTo && priceTo !== "" && priceTo !== "0.00") {
    return `€${lower} – €${parseFloat(priceTo).toFixed(2)}`;
  }
  return `€${lower}`;
}

export default function PatientProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  }, [products, searchQuery]);

  const procedures = filteredProducts.filter(
    (p) => (p.category || "extra") === "procedure"
  );
  const extras = filteredProducts.filter(
    (p) => (p.category || "extra") !== "procedure"
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Clinic header card */}
      <header className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-7 space-y-3">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-navy">
            {CLINIC.name}
          </h1>
          <a
            href={CLINIC.phoneHref}
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-gold hover:text-gold text-navy text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gold" /> {CLINIC.phone}
          </a>
        </div>
        <p className="inline-flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
          <span>{CLINIC.address}</span>
        </p>
      </header>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products & treatments…"
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[320px] shimmer rounded-2xl bg-gray-50" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm border border-dashed border-gray-200 rounded-2xl">
          No products match your search.
        </div>
      ) : (
        <div className="space-y-12">
          {procedures.length > 0 && (
            <ProductSection
              title="Dental Procedures"
              subtitle="Chairside treatments delivered at the clinic"
              icon={<Sparkles className="w-3.5 h-3.5" />}
              products={procedures}
              ctaLabel="View & Book"
            />
          )}

          {extras.length > 0 && (
            <ProductSection
              title="Extras"
              subtitle="Take-home oral care recommended by the clinic"
              icon={<ShoppingBag className="w-3.5 h-3.5" />}
              products={extras}
              ctaLabel="View & Order"
            />
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------- Section -------------------- */

function ProductSection({
  title,
  subtitle,
  icon,
  products,
  ctaLabel,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  products: Product[];
  ctaLabel: string;
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4 border-b border-gray-100 pb-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-gold">
            {icon}
            {title}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy mt-1">
            {title}
          </h2>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{products.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} ctaLabel={ctaLabel} />
        ))}
      </div>
    </section>
  );
}

/* -------------------- Card -------------------- */

function ProductCard({
  product,
  ctaLabel,
}: {
  product: Product;
  ctaLabel: string;
}) {
  const isProcedure = product.category === "procedure";
  const isOutOfStock = !isProcedure && product.stockCount === 0;
  const isLowStock = !isProcedure && product.stockCount > 0 && product.stockCount <= 5;

  return (
    <Link
      href={`/portal/products/${product.id}`}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gold/40 transition-all flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-off-white">
            <Package className="w-10 h-10 text-gold/30" />
          </div>
        )}
        {/* Status badges */}
        {isProcedure ? (
          <span className="absolute top-3 left-3 bg-navy text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Procedure
          </span>
        ) : isOutOfStock ? (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Out of stock
          </span>
        ) : isLowStock ? (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Only {product.stockCount} left
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            In Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-2.5">
        <h3 className="font-serif text-base font-bold text-navy leading-snug line-clamp-2">
          {product.name}
        </h3>
        <span className="font-serif text-lg font-bold text-gold">
          {formatPrice(product.price, product.priceTo)}
        </span>
        {product.description && (
          <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-3 flex-1">
            {product.description}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-3">
          {!isProcedure && (
            <span className={`text-[10px] font-semibold ${
              isOutOfStock ? "text-red-400" : isLowStock ? "text-amber-500" : "text-emerald-600"
            }`}>
              {isOutOfStock ? "Unavailable" : `${product.stockCount} in stock`}
            </span>
          )}
          <span className={`ml-auto bg-navy group-hover:bg-gold text-white group-hover:text-navy font-bold py-2 px-4 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5`}>
            {ctaLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
