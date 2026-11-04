"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowRight, Sparkles } from "lucide-react";
import { Product, Category, Banner } from "@/lib/types";
import { getProducts, getCategories, getBanners } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import BannersHubSlider from "@/components/BannersHubSlider";
import TopCategoriesMarquee from "@/components/TopCategoriesMarquee";
import BrandsMarquee from "@/components/BrandsMarquee";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Shimmer";

export default function HomePage() {
  const { openQuickCheckout, addToCart } = useCart();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData(isInitial = false) {
      if (isInitial) setLoading(true);
      try {
        const [fetchedBanners, fetchedCategories, dealsRes, featuredRes] = await Promise.all([
          getBanners(),
          getCategories(),
          getProducts({ flashDeals: true, limit: 4 }), // Strictly top 4 flash deals
          getProducts({ limit: 8 }), // Strictly 8 products on homepage
        ]);

        setBanners(fetchedBanners);
        setCategories(fetchedCategories);
        setFlashDeals(dealsRes.products.slice(0, 4));
        setFeaturedProducts(featuredRes.products.slice(0, 8));
      } catch (err) {
        console.error("Home data fetch error:", err);
      } finally {
        if (isInitial) setLoading(false);
      }
    }

    loadHomeData(true);

    // Listen for product or category updates from admin live
    const handleUpdate = () => {
      loadHomeData(false); // Silent background revalidation - never unmounts or flashes skeleton
    };
    window.addEventListener("kb_products_updated", handleUpdate);
    window.addEventListener("kb_categories_updated", handleUpdate);
    window.addEventListener("kb_banners_updated", handleUpdate);
    return () => {
      window.removeEventListener("kb_products_updated", handleUpdate);
      window.removeEventListener("kb_categories_updated", handleUpdate);
      window.removeEventListener("kb_banners_updated", handleUpdate);
    };
  }, []);

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* 1. Hero Promotional Banner Hub */}
      <BannersHubSlider banners={banners} />

      {/* 2. Top Categories Continuous Marquee */}
      <TopCategoriesMarquee categories={categories} />

      {/* 3. Flash Deals (Strictly Top 4 Products on Homepage) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-brand-pink/10 via-rose-50 to-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-brand-pink/20 shadow-xs">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-600 to-brand-pink text-white shadow-md">
                <Flame className="w-5 h-5 animate-pulse text-yellow-300" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-pink">
                  Hot 24H Deals
                </span>
                <h2 className="text-base sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>Flash Deals Converter</span>
                  <span className="text-[10px] sm:text-xs bg-brand-yellow text-slate-900 font-extrabold px-2 py-0.5 rounded-full">
                    SAVE UP TO 40%
                  </span>
                </h2>
              </div>
            </div>
            <Link
              href="/flash-deals"
              className="text-xs font-bold text-brand-pink hover:text-brand-pinkHover flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-brand-pink/20 shadow-xs hover:shadow transition"
            >
              <span>See All Flash Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {flashDeals.map((product) => (
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
      </section>

      {/* 4. Trending & Featured Products (Strictly 8 Products on Homepage) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-yellow" />
              <span>Handpicked For You</span>
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              Popular & Trending in Pakistan
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-brand-pink hover:text-brand-pinkHover flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickOrder={(p) => openQuickCheckout(p)}
                  onAddToCart={(p) => addToCart(p)}
                />
              ))}
            </div>

            {/* Bottom Button: Explore All Products */}
            <div className="pt-8 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-brand-pink text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore All Products in Pakistan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* 5. Authorized Brands & Genuine Quality Marquee */}
      <BrandsMarquee />

      {/* 6. Why Shop With Abrish Mart? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-pink">
            Why Choose Abrish Mart?
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-1 mb-4">
            Shop Smart, Save More Across Pakistan
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
            Abrish Mart is dedicated to delivering genuine lifestyle, bridal silk loungewear, educational kids toys, and smart accessories right to your doorstep. We offer standard Cash on Delivery nationwide, 7-day hassle-free replacement, and direct WhatsApp customer support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 font-black">
                1
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Order in 1-Click</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                No complicated account logins. Just your name, phone, and address.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center mb-2 font-black">
                2
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Fast Courier Dispatch</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Shipped with tracking via Leopard & Trax express couriers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2 font-black">
                3
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Cash on Delivery</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Inspect your parcel and pay cash safely at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
