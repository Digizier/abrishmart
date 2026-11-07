"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Clock, Zap, ArrowLeft, Sparkles, Filter } from "lucide-react";
import { Product } from "@/lib/types";
import { getProducts, getCategories } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Shimmer";

export default function FlashDealsPage() {
  const { openQuickCheckout, addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<any[]>([]);

  // Simulated countdown timer (resetting every 24h)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadDeals() {
      setLoading(true);
      const [prodsRes, catsRes] = await Promise.all([
        getProducts({ flashDeals: true, limit: 50 }),
        getCategories(),
      ]);
      setProducts(prodsRes.products);
      setCategories(catsRes);
      setLoading(false);
    }
    loadDeals();
  }, []);

  const filtered =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category_slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <Link href="/" className="hover:text-brand-pink flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900">Flash Deals</span>
      </div>

      {/* Hero Countdown Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-brand-pink to-amber-500 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-yellow-300">
            <Flame className="w-4 h-4 animate-pulse" />
            <span>Limited Time Flash Sale</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Flash Deals Extravaganza
          </h1>
          <p className="text-xs sm:text-sm text-white/90 font-medium">
            Exclusive deals on bridal nightwear, educational kids toys, smart accessories, and kitchen essentials. Save up to 40% with nationwide Cash on Delivery.
          </p>

          {/* Countdown Clock */}
          <div className="pt-2 flex items-center gap-2 sm:gap-3 text-slate-900 font-mono font-black">
            <span className="text-white text-xs font-bold flex items-center gap-1 mr-1">
              <Clock className="w-4 h-4" />
              <span>Ends in:</span>
            </span>
            <div className="bg-white px-3 py-2 rounded-xl text-center shadow-md">
              <span className="text-sm sm:text-lg block leading-none">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-slate-400 font-sans uppercase">Hours</span>
            </div>
            <span className="text-white text-lg font-bold">:</span>
            <div className="bg-white px-3 py-2 rounded-xl text-center shadow-md">
              <span className="text-sm sm:text-lg block leading-none">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-slate-400 font-sans uppercase">Mins</span>
            </div>
            <span className="text-white text-lg font-bold">:</span>
            <div className="bg-white px-3 py-2 rounded-xl text-center shadow-md">
              <span className="text-sm sm:text-lg block leading-none">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-slate-400 font-sans uppercase">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs by Category */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
            selectedCategory === "all"
              ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Flash Deals ({products.length})
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedCategory === c.slug
                ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <p className="text-sm font-bold text-slate-700">No active flash deals in this category.</p>
          <Link
            href="/shop"
            className="inline-block px-5 py-2.5 bg-brand-pink text-white font-bold text-xs rounded-xl shadow-md"
          >
            Browse Full Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickOrder={(p) => openQuickCheckout(p)}
              onAddToCart={(p) => addToCart(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
