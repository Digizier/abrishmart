"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingBag, PhoneCall, PackageSearch } from "lucide-react";

interface MobileBottomNavProps {
  onOpenCart: () => void;
  cartCount: number;
}

export default function MobileBottomNav({ onOpenCart, cartCount = 0 }: MobileBottomNavProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isShop = pathname?.startsWith("/shop") || pathname?.startsWith("/category");
  const isTrack = pathname === "/track-order";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
      <div className="grid grid-cols-5 h-14 items-center">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 py-1 transition ${
            isHome ? "text-brand-pink font-bold" : "text-slate-600 hover:text-brand-pink"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* Shop / Categories */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center gap-1 py-1 transition ${
            isShop ? "text-brand-pink font-bold" : "text-slate-600 hover:text-brand-pink"
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px]">Categories</span>
        </Link>

        {/* Cart Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-600 hover:text-brand-pink relative transition"
          aria-label="Open Shopping Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-pink text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>

        {/* Track Order */}
        <Link
          href="/track-order"
          className={`flex flex-col items-center justify-center gap-1 py-1 transition ${
            isTrack ? "text-brand-pink font-bold" : "text-slate-600 hover:text-brand-pink"
          }`}
        >
          <PackageSearch className="w-5 h-5" />
          <span className="text-[10px]">Track</span>
        </Link>

        {/* WhatsApp Helpline */}
        <a
          href="https://wa.me/923452086160"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-1 text-emerald-600 hover:text-emerald-700 transition"
        >
          <PhoneCall className="w-5 h-5" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
