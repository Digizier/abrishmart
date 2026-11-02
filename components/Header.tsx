"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Phone, Menu, X, ChevronDown, PackageCheck } from "lucide-react";
import { Product } from "@/lib/types";
import { getProducts } from "@/lib/db";

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

  // Click outside listener for search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
            <div className="relative h-10 sm:h-12 w-36 sm:w-44">
              <Image
                src="/images/logo/logo-text.png"
                alt="Abrish Mart"
                fill
                sizes="(max-width: 640px) 144px, 176px"
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
                        href={`/product/${item.slug}`}
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
                            <span className="text-xs font-bold text-brand-pink">Rs. {item.price.toLocaleString()}</span>
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
          <div className="flex items-center gap-2 sm:gap-4">
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 border-t border-slate-100 py-2.5 text-xs font-semibold text-slate-700">
          <Link href="/" className="hover:text-brand-pink transition">
            Home
          </Link>
          <Link href="/shop" className="hover:text-brand-pink transition">
            All Products
          </Link>
          <Link href="/category/bridal-silk-nightwear" className="hover:text-brand-pink transition flex items-center gap-1">
            <span>Bridal Silk & Nightwear</span>
            <span className="bg-brand-pink text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">Hot</span>
          </Link>
          <Link href="/category/kids-educational-toys" className="hover:text-brand-pink transition">
            Kids & Toys
          </Link>
          <Link href="/category/fashion-watches" className="hover:text-brand-pink transition">
            Fashion & Watches
          </Link>
          <Link href="/category/smart-gadgets-audio" className="hover:text-brand-pink transition">
            Smart Gadgets
          </Link>
          <Link href="/track-order" className="hover:text-brand-pink transition ml-auto text-emerald-700 font-bold">
            Order Tracking
          </Link>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg animate-in fade-in duration-150">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-brand-pink py-1.5 border-b border-slate-100"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-brand-pink py-1.5 border-b border-slate-100"
          >
            All Products Catalog
          </Link>
          <Link
            href="/category/bridal-silk-nightwear"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-sm font-semibold text-slate-800 hover:text-brand-pink py-1.5 border-b border-slate-100"
          >
            <span>Bridal Silk & Nightwear</span>
            <span className="bg-brand-pink text-white text-[10px] px-2 py-0.5 rounded font-bold">Hot</span>
          </Link>
          <Link
            href="/category/kids-educational-toys"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-brand-pink py-1.5 border-b border-slate-100"
          >
            Kids & Toys
          </Link>
          <Link
            href="/category/fashion-watches"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-brand-pink py-1.5 border-b border-slate-100"
          >
            Fashion & Watches
          </Link>
          <Link
            href="/category/smart-gadgets-audio"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-brand-pink py-1.5 border-b border-slate-100"
          >
            Smart Gadgets & Audio
          </Link>
          <Link
            href="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-emerald-700 py-1.5"
          >
            Track Your Order
          </Link>
        </div>
      )}
    </header>
  );
}
