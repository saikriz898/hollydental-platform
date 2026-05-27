"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import {
  ShoppingBag,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "@/lib/toast";

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

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=600";

function formatPrice(price: string, priceTo?: string | null) {
  const lower = parseFloat(price).toFixed(2);
  if (priceTo && priceTo !== "" && priceTo !== "0.00") {
    return `€${lower} – €${parseFloat(priceTo).toFixed(2)}`;
  }
  return `€${lower}`;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<"procedure" | "extra">(
    "extra"
  );
  const [formPrice, setFormPrice] = useState("");
  const [formPriceTo, setFormPriceTo] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formStock, setFormStock] = useState("0");
  const [formDisplayOrder, setFormDisplayOrder] = useState("0");
  const [btnLoading, setBtnLoading] = useState(false);

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

  const resetForm = () => {
    setEditId(null);
    setFormName("");
    setFormDescription("");
    setFormCategory("extra");
    setFormPrice("");
    setFormPriceTo("");
    setFormImageUrl("");
    setFormStock("0");
    setFormDisplayOrder("0");
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setEditId(product.id);
    setFormName(product.name);
    setFormDescription(product.description || "");
    setFormCategory(
      (product.category as "procedure" | "extra") || "extra"
    );
    setFormPrice(product.price);
    setFormPriceTo(product.priceTo || "");
    setFormImageUrl(product.imageUrl || "");
    setFormStock(String(product.stockCount));
    setFormDisplayOrder(String(product.displayOrder ?? 0));
  };

  const handleAddNew = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action is permanent."
      )
    )
      return;
    try {
      await apiRequest(`/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete product.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) {
      toast.error("Product name and price are required.");
      return;
    }
    if (formPriceTo && parseFloat(formPriceTo) < parseFloat(formPrice)) {
      toast.error("Upper price must be greater than or equal to price.");
      return;
    }
    setBtnLoading(true);
    try {
      const payload: Record<string, any> = {
        name: formName,
        description: formDescription,
        category: formCategory,
        price: formPrice,
        priceTo: formPriceTo || null,
        imageUrl: formImageUrl || PLACEHOLDER_IMAGE,
        stockCount: parseInt(formStock, 10) || 0,
        displayOrder: parseInt(formDisplayOrder, 10) || 0,
      };

      if (editId) {
        const result = (await apiRequest(`/products/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })) as Product;
        setProducts((prev) => prev.map((p) => (p.id === editId ? result : p)));
        toast.success("Product details updated.");
      } else {
        const result = (await apiRequest("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        })) as Product;
        setProducts((prev) => [result, ...prev]);
        toast.success("New product registered successfully.");
      }
      setIsEditing(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save product.");
    } finally {
      setBtnLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      <header className="border-b border-gray-200 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 bg-gold/10 text-gold text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            <ShoppingBag className="w-3 h-3" /> Catalog Manager
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mt-1">
            Clinical Products
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Manage chairside procedures (with price ranges) and take-home
            extras patients can reserve.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="bg-gold hover:bg-gold-dark text-navy font-bold px-4 py-2.5 rounded-lg text-xs shadow flex items-center gap-1.5 focus:outline-none"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </header>

      {isEditing ? (
        <div className="border border-gray-200 bg-white rounded-2xl p-6 max-w-2xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-serif text-base font-bold text-navy">
              {editId ? `Editing: ${formName}` : "Add new product"}
            </h3>
            <button
              onClick={() => {
                setIsEditing(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-navy"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={handleSave}
            className="space-y-4 text-xs text-navy font-semibold"
          >
            <div className="space-y-1.5">
              <label>Product Name *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Pola Light Teeth Whitening Kit"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-navy focus:outline-none focus:bg-white focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label>Category *</label>
                <select
                  value={formCategory}
                  onChange={(e) =>
                    setFormCategory(e.target.value as "procedure" | "extra")
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-navy focus:outline-none focus:bg-white focus:border-gold"
                >
                  <option value="extra">Extra (retail item)</option>
                  <option value="procedure">Procedure (chairside)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label>Display Order</label>
                <input
                  type="number"
                  value={formDisplayOrder}
                  onChange={(e) => setFormDisplayOrder(e.target.value)}
                  placeholder="0"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-navy focus:outline-none focus:bg-white focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label>Description</label>
              <textarea
                rows={4}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Indications, ingredients, what's included…"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-navy focus:outline-none focus:bg-white focus:border-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label>Price (&euro;) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-navy focus:outline-none focus:bg-white focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label>Upper price (&euro;)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formPriceTo}
                  onChange={(e) => setFormPriceTo(e.target.value)}
                  placeholder="optional"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-navy focus:outline-none focus:bg-white focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label>Stock count</label>
                <input
                  type="number"
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  placeholder="0"
                  disabled={formCategory === "procedure"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-navy focus:outline-none focus:bg-white focus:border-gold disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label>Photo URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://…"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-navy focus:outline-none focus:bg-white focus:border-gold"
                />
                <div className="w-12 h-12 border border-gray-200 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {formImageUrl ? (
                    <img
                      src={formImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  resetForm();
                }}
                className="border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={btnLoading}
                className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-2.5 rounded-lg text-xs shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {btnLoading ? "Saving…" : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 shimmer rounded-xl bg-gray-50" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              No products yet. Add the clinic's first item to get started.
            </div>
          ) : (
            <div className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-navy uppercase tracking-wider font-bold text-[10px]">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-navy font-medium">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50/40 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ShoppingBag className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold block truncate max-w-[260px]">
                                {product.name}
                              </span>
                              <span className="text-[10px] text-gray-400 font-normal truncate block max-w-[260px]">
                                {product.description || "—"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                              product.category === "procedure"
                                ? "bg-navy/5 text-navy"
                                : "bg-gold/10 text-gold"
                            }`}
                          >
                            {product.category === "procedure"
                              ? "Procedure"
                              : "Extra"}
                          </span>
                        </td>
                        <td className="p-4 font-bold font-serif text-gold">
                          {formatPrice(product.price, product.priceTo)}
                        </td>
                        <td className="p-4">
                          {product.category === "procedure" ? (
                            <span className="text-[10px] text-gray-400 italic">
                              n/a
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                                product.stockCount === 0
                                  ? "bg-red-50 text-red-600"
                                  : product.stockCount <= 5
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              {product.stockCount} in stock
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-gray-400 hover:text-gold"
                              title="Edit product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-gray-400 hover:text-red-500"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
