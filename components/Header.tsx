"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  Phone,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  PackageCheck,
  Flame,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Product, Category, Subcategory } from "@/lib/types";
import { getProducts, getCategories } from "@/lib/db";

interface HeaderProps {
  onOpenCart?: () => void;
  cartCount?: number;
}

export default function Header({ onOpenCart, cartCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Dynamic Categories from Database / Admin
  const [categories, setCategories] = useState<Category[]>([]);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeHoverCategory, setActiveHoverCategory] = useState<Category | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Mobile Accordion state for categories
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [mobileExpandedSub, setMobileExpandedSub] = useState<string | null>(null);

  // Load and sync categories
  const loadHeaderCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
      if (cats.length > 0 && !activeHoverCategory) {
        setActiveHoverCategory(cats[0]);
      }
    } catch {}
  };

  useEffect(() => {
    loadHeaderCategories();

    // Listen for admin category updates live
    const handleUpdate = () => {
      loadHeaderCategories();
    };

    window.addEventListener("kb_categories_updated", handleUpdate);
    return () => window.removeEventListener("kb_categories_updated", handleUpdate);
  }, []);

  // Debounced search logic for Pakistani/Hinglish search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const { products } = await getProducts({ search: searchQuery.trim(), limit: 5 });
      setSearchResults(products);
      setIsSearching(false);
      setShowSearchDropdown(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for search & mega-menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-brand-pink focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo with Text */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative h-11 sm:h-14 w-44 sm:w-56">
              <Image
                src="/images/logo/logo-text.png"
                alt="Abrish Mart"
                fill
                sizes="(max-width: 640px) 176px, 224px"
                className="object-contain object-left"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Search Bar (Desktop / Tablet) */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg mx-4 relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, nighty, toys, gadgets... (Hinglish/English)"
                className="w-full bg-slate-50 border border-slate-300 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Live Autocomplete Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-500">Searching matching products...</div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/?slug=${encodeURIComponent(item.slug)}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-brand-softPink transition group"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <Image
                            src={item.thumbnail_url}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover group-hover:scale-105 transition"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-brand-pink">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-brand-pink">
                              Rs. {item.price.toLocaleString()}
                            </span>
                            {item.original_price && item.original_price > item.price && (
                              <span className="text-[10px] text-slate-400 line-through">
                                Rs. {item.original_price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/shop?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="block p-2.5 text-center text-xs font-medium text-brand-pink bg-brand-softPink/60 hover:bg-brand-softPink"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo; →
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No products found for &ldquo;{searchQuery}&rdquo;. Try another keyword.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Track Order Shortcut */}
            <Link
              href="/track-order"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-brand-pink px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <span>Track Order</span>
            </Link>

            {/* WhatsApp Contact */}
            <a
              href="https://wa.me/923452086160"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold px-3 py-2 rounded-full border border-emerald-200 transition shrink-0"
              title="Chat with Usman Shah on WhatsApp"
            >
              <Phone className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span className="hidden sm:inline">0345-2086160</span>
            </a>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2.5 bg-brand-softPink text-brand-pink hover:bg-brand-pink hover:text-white rounded-full transition shadow-sm"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Below Header on Mobile) */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products in Pakistan..."
              className="w-full bg-slate-50 border border-slate-300 rounded-full py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* =========================================================
            DESKTOP NAVIGATION ROW WITH DARAZ-STYLE MEGA MENU & FLASH SALE
        ========================================================= */}
        <nav className="hidden md:flex items-center justify-between border-t border-slate-100 py-2 text-xs font-semibold text-slate-700 relative">
          <div className="flex items-center gap-6">
            {/* 1. All Categories Dropdown Button (Daraz Mega-Menu Trigger) */}
            <div ref={megaMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                onMouseEnter={() => setMegaMenuOpen(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition ${
                  megaMenuOpen
                    ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                    : "bg-slate-100 hover:bg-brand-softPink hover:text-brand-pink text-slate-900"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega-Menu Flyout (Daraz Multi-level Structure) */}
              {megaMenuOpen && (
                <div
                  onMouseLeave={() => setMegaMenuOpen(false)}
                  className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex w-[780px] min-h-[360px] animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  {/* Left Column: Primary Categories */}
                  <div className="w-64 bg-slate-50 border-r border-slate-200/80 p-2 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase px-2.5 py-1 block">
                      Main Departments
                    </span>
                    {categories.map((cat) => {
                      const isActive =
                        (activeHoverCategory?.slug || categories[0]?.slug) === cat.slug;
                      return (
                        <div
                          key={cat.id}
                          onMouseEnter={() => setActiveHoverCategory(cat)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                            isActive
                              ? "bg-white text-brand-pink shadow-xs font-bold border border-slate-200/80"
                              : "text-slate-700 hover:bg-white/80 hover:text-slate-900"
                          }`}
                        >
                          <Link
                            href={`/category/?slug=${cat.slug}`}
                            onClick={() => setMegaMenuOpen(false)}
                            className="flex items-center gap-2.5 truncate flex-1"
                          >
                            <span className="w-2 h-2 rounded-full bg-brand-pink"></span>
                            <span className="truncate">{cat.name}</span>
                          </Link>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Subcategories & Child Categories (Multi-level) */}
                  <div className="flex-1 p-6 bg-white overflow-y-auto max-h-[460px]">
                    {activeHoverCategory ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="text-sm font-black text-slate-900">
                              {activeHoverCategory.name}
                            </h3>
                            <p className="text-[11px] text-slate-400">
                              Explore subcategories and specialized collections
                            </p>
                          </div>
                          <Link
                            href={`/category/?slug=${activeHoverCategory.slug}`}
                            onClick={() => setMegaMenuOpen(false)}
                            className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1"
                          >
                            <span>View All Products</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* Subcategories Grid */}
                        {activeHoverCategory.subcategories &&
                        activeHoverCategory.subcategories.length > 0 ? (
                          <div className="grid grid-cols-2 gap-6">
                            {activeHoverCategory.subcategories.map((sub) => (
                              <div key={sub.id} className="space-y-2">
                                <Link
                                  href={`/category/?slug=${activeHoverCategory.slug}&sub=${sub.slug}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  className="font-bold text-xs text-slate-900 hover:text-brand-pink block pb-1 border-b border-slate-100"
                                >
                                  {sub.name}
                                </Link>

                                {/* Level 3: Child Subcategories */}
                                {sub.child_subcategories && sub.child_subcategories.length > 0 && (
                                  <div className="space-y-1 pl-2">
                                    {sub.child_subcategories.map((child) => (
                                      <Link
                                        key={child.id}
                                        href={`/category/?slug=${activeHoverCategory.slug}&sub=${sub.slug}&child=${child.slug}`}
                                        onClick={() => setMegaMenuOpen(false)}
                                        className="text-[11px] text-slate-500 hover:text-brand-pink block py-0.5 hover:translate-x-1 transition-transform"
                                      >
                                        • {child.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center text-slate-400 text-xs">
                            <p>Browse full catalog in {activeHoverCategory.name}</p>
                            <Link
                              href={`/category/?slug=${activeHoverCategory.slug}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className="inline-block mt-3 px-4 py-2 bg-brand-softPink text-brand-pink font-bold rounded-xl text-xs"
                            >
                              Open Department Catalog
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs">Select a department</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Direct Primary Category Links (Synced with Admin Categories) */}
            <Link href="/" className="hover:text-brand-pink transition font-bold text-slate-900">
              Home
            </Link>
            <Link href="/shop" className="hover:text-brand-pink transition">
              All Products
            </Link>

            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/?slug=${cat.slug}`}
                className="hover:text-brand-pink transition truncate max-w-[150px]"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Right Action: FLASH SALE Active Highlighted Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/flash-deals"
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-rose-600 via-brand-pink to-amber-500 text-white rounded-full font-black text-xs shadow-md shadow-brand-pink/20 hover:scale-105 transition group"
            >
              <Flame className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
              <span>FLASH SALE</span>
              <span className="bg-white text-rose-600 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Hot
              </span>
            </Link>

            <Link href="/track-order" className="hover:text-brand-pink transition text-emerald-700 font-bold">
              Track Order
            </Link>
          </div>
        </nav>
      </div>

      {/* =========================================================
          MOBILE MENU DRAWER WITH ACCORDION SUB-CATEGORIES
      ========================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-[80px] z-50 bg-white border-b border-slate-200 px-4 pt-4 pb-12 space-y-3 shadow-2xl overflow-y-auto overscroll-contain">
          {/* Flash Sale Banner on Mobile */}
          <Link
            href="/flash-deals"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-600 via-brand-pink to-amber-500 text-white font-extrabold text-xs shadow-md"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>FLASH SALE (Up to 40% OFF)</span>
            </div>
            <span className="text-[10px] bg-white text-rose-600 px-2 py-0.5 rounded-full font-black">
              EXPLORE
            </span>
          </Link>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-slate-800 hover:text-brand-pink py-1.5 border-b border-slate-100"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-slate-800 hover:text-brand-pink py-1.5 border-b border-slate-100"
          >
            All Products Catalog
          </Link>

          {/* Dynamic Accordion Categories */}
          <div className="pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Departments & Subcategories
            </span>

            <div className="space-y-1.5">
              {categories.map((cat) => {
                const isExpanded = mobileExpandedCat === cat.slug;
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;

                return (
                  <div key={cat.id} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                    <div className="flex items-center justify-between p-2.5">
                      <Link
                        href={`/category/?slug=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-bold text-xs text-slate-900 hover:text-brand-pink flex-1"
                      >
                        {cat.name}
                      </Link>

                      {hasSubs && (
                        <button
                          type="button"
                          onClick={() => setMobileExpandedCat(isExpanded ? null : cat.slug)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180 text-brand-pink" : ""}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Subcategories Level 2 */}
                    {isExpanded && hasSubs && (
                      <div className="bg-white p-3 border-t border-slate-100 space-y-2">
                        {cat.subcategories!.map((sub) => {
                          const isSubExpanded = mobileExpandedSub === sub.slug;
                          const hasChildren = sub.child_subcategories && sub.child_subcategories.length > 0;

                          return (
                            <div key={sub.id} className="pl-2 border-l-2 border-brand-softPink">
                              <div className="flex items-center justify-between">
                                <Link
                                  href={`/category/?slug=${cat.slug}&sub=${sub.slug}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="text-xs font-semibold text-slate-800 hover:text-brand-pink"
                                >
                                  {sub.name}
                                </Link>
                                {hasChildren && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setMobileExpandedSub(isSubExpanded ? null : sub.slug)
                                    }
                                    className="p-1 text-slate-400"
                                  >
                                    <ChevronRight
                                      className={`w-3.5 h-3.5 transition-transform ${isSubExpanded ? "rotate-90 text-brand-pink" : ""}`}
                                    />
                                  </button>
                                )}
                              </div>

                              {/* Level 3 Children */}
                              {isSubExpanded && hasChildren && (
                                <div className="mt-1 space-y-1 pl-3">
                                  {sub.child_subcategories!.map((ch) => (
                                    <Link
                                      key={ch.id}
                                      href={`/category/?slug=${cat.slug}&sub=${sub.slug}&child=${ch.slug}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block text-[11px] text-slate-500 hover:text-brand-pink py-0.5"
                                    >
                                      • {ch.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-emerald-700 py-2 border-t border-slate-100"
          >
            Track Your Order (COD Status)
          </Link>
        </div>
      )}
    </header>
  );
}
