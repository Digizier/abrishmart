"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Product, Category } from "@/lib/types";
import { getProducts, getCategories } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Shimmer";

export default function CategoryClientView({ slug }: { slug: string }) {
  const { openQuickCheckout, addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categoryName, setCategoryName] = useState("Category");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // STRICT 8 PRODUCTS PER PAGE

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    async function loadData() {
      setLoading(true);
      const [cats, prodRes] = await Promise.all([
        getCategories(),
        getProducts({ category: slug, offset: (currentPage - 1) * pageSize, limit: pageSize }),
      ]);

      const found = cats.find((c) => c.slug === slug);
      if (found) {
        setCategoryName(found.name);
      } else {
        setCategoryName(slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));
      }

      setProducts(prodRes.products);
      setTotal(prodRes.total);
      setLoading(false);
    }
    loadData();
  }, [slug, currentPage]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-pink flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-pink">
          Shop
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{categoryName}</span>
      </nav>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-brand-pink/10 via-rose-50 to-amber-50 rounded-2xl p-6 sm:p-8 border border-brand-pink/20">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-pink">
          Category Collection
        </span>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">{categoryName}</h1>
        <p className="text-xs text-slate-600 mt-1">
          Showing {products.length} of {total} products available with Cash on Delivery across Pakistan.
        </p>
      </div>

      {/* Product Grid (8 items per page) */}
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <p className="text-sm font-bold text-slate-700">No products currently available in this category.</p>
          <Link
            href="/shop"
            className="inline-block bg-brand-pink text-white text-xs font-bold py-2 px-5 rounded-full shadow"
          >
            Explore Other Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickOrder={(p) => openQuickCheckout(p)}
              onAddToCart={(p) => addToCart(p)}
            />
          ))}
        </div>
      )}

      {/* Pagination (Page 1, 2, 3...) */}
      {totalPages > 1 && (
        <div className="pt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx + 1}
              type="button"
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                currentPage === idx + 1
                  ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
