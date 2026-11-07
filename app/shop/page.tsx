"use client";

import React, { useState, useEffect } from "react";
import { Filter, ChevronLeft, ChevronRight, X, SlidersHorizontal, Check } from "lucide-react";
import { Product, Category } from "@/lib/types";
import { getProducts, getCategories } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Shimmer";

export default function ShopPage() {
  const { openQuickCheckout, addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "price_low" | "price_high">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 12 items per page perfectly fills 2, 3, 4, and 6-column grids without gaps

  // Mobile Filter Drawer State
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState<string>("");

  useEffect(() => {
    async function fetchCategories() {
      const cats = await getCategories();
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function loadShopData() {
      setLoading(true);
      const res = await getProducts({
        category: selectedCategory || undefined,
        search: searchQuery || undefined,
        offset: (currentPage - 1) * pageSize,
        limit: pageSize,
      });

      let sorted = [...res.products];
      if (sortBy === "price_low") {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price_high") {
        sorted.sort((a, b) => b.price - a.price);
      }

      setProducts(sorted);
      setTotal(res.total);
      setLoading(false);
    }

    loadShopData();
  }, [selectedCategory, searchQuery, sortBy, currentPage]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  // Handle mobile drawer apply
  const handleApplyFilter = () => {
    setSelectedCategory(tempCategory);
    setCurrentPage(1);
    setFilterDrawerOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[11px] font-extrabold text-brand-pink uppercase tracking-widest">
            Abrish Mart Catalog
          </span>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || "Category Products"
              : "All Products Collection"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {products.length} of {total} products (8 items per page)
          </p>
        </div>

        {/* Sort Controls & Mobile Filter Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setTempCategory(selectedCategory);
              setFilterDrawerOpen(true);
            }}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-pink" />
            <span>Filters</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "latest" | "price_low" | "price_high")}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-pink/20"
          >
            <option value="latest">Sort: Newest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filter (NO CRAMPED MAX-H-64 SCROLL TRAP) */}
        <aside className="hidden md:block bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-5">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-brand-pink" />
              <span>Browse Categories</span>
            </h3>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("");
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === ""
                    ? "bg-brand-pink text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                All Categories ({total})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    selectedCategory === cat.slug
                      ? "bg-brand-pink text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Delivery Assurance</h4>
            <div className="p-3 bg-brand-softPink/60 rounded-xl text-[11px] text-slate-700 space-y-1.5">
              <p className="font-semibold text-brand-pink">🇵🇰 Cash on Delivery</p>
              <p>Free delivery on orders above Rs. 2,500 nationwide.</p>
            </div>
          </div>
        </aside>

        {/* Main Product Grid (Strict 8 items per page) */}
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
              <p className="text-sm font-bold text-slate-700">No products found in this category.</p>
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className="text-xs font-bold text-brand-pink hover:underline"
              >
                Clear Filters & Show All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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

          {/* Strict Pagination (Page 1, 2, 3...) */}
          {totalPages > 1 && (
            <div className="pt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                      currentPage === pageNumber
                        ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal / Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-xs bg-white h-full flex flex-col p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Select Category</h3>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1 rounded-full text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of categories with clean buttons (NO PREMATURE PAGE NAVIGATIONS) */}
            <div className="flex-1 overflow-y-auto py-3 space-y-1.5">
              <button
                type="button"
                onClick={() => setTempCategory("")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  tempCategory === "" ? "bg-brand-softPink text-brand-pink border border-brand-pink/30" : "text-slate-700"
                }`}
              >
                <span>All Categories</span>
                {tempCategory === "" && <Check className="w-4 h-4 text-brand-pink" />}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setTempCategory(c.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    tempCategory === c.slug ? "bg-brand-softPink text-brand-pink border border-brand-pink/30" : "text-slate-700"
                  }`}
                >
                  <span>{c.name}</span>
                  {tempCategory === c.slug && <Check className="w-4 h-4 text-brand-pink" />}
                </button>
              ))}
            </div>

            {/* Apply Button */}
            <div className="pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleApplyFilter}
                className="w-full bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-extrabold py-3 rounded-xl shadow-md transition"
              >
                Done (Apply Filter)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
