"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingBag, PhoneCall, PackageSearch } from "lucide-react";

interface MobileBottomNavProps {
  onOpenCart: () => void;
  cartCount: number;
}

export default function MobileBottomNav({ onOpenCart, cartCount = 0 }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleMenuState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen?: boolean }>;
      setIsMenuOpen(Boolean(customEvent.detail?.isOpen));
    };

    window.addEventListener("kb_mobile_menu_state", handleMenuState);
    return () => window.removeEventListener("kb_mobile_menu_state", handleMenuState);
  }, []);

  // When mobile header menu is open, hide the bottom navigation dock completely to prevent any overlap
  if (isMenuOpen) return null;

  const isHome = pathname === "/";
  const isShop = pathname?.startsWith("/shop") || pathname?.startsWith("/category");
  const isTrack = pathname === "/track-order";

  return (
    <div className="fixed bottom-3 inset-x-3.5 z-40 md:hidden pb-[env(safe-area-inset-bottom)] pointer-events-none">
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto bg-white/95 backdrop-blur-2xl border border-slate-300/80 rounded-[28px] shadow-[0_14px_40px_rgba(0,0,0,0.16)] ring-1 ring-black/5 px-2 py-1.5 transition-all duration-200"
      >
        <div className="grid grid-cols-5 items-center h-14">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-2xl transition-all duration-200 ${
              isHome
                ? "text-brand-pink font-bold bg-pink-50/90 shadow-2xs scale-102"
                : "text-slate-600 hover:text-brand-pink hover:bg-slate-50"
            }`}
          >
            <Home className={`w-5 h-5 transition-transform ${isHome ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            <span className="text-[10px] tracking-tight">Home</span>
          </Link>

          {/* Shop / Categories */}
          <Link
            href="/shop"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-2xl transition-all duration-200 ${
              isShop
                ? "text-brand-pink font-bold bg-pink-50/90 shadow-2xs scale-102"
                : "text-slate-600 hover:text-brand-pink hover:bg-slate-50"
            }`}
          >
            <Grid className={`w-5 h-5 transition-transform ${isShop ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            <span className="text-[10px] tracking-tight">Categories</span>
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-2xl text-slate-600 hover:text-brand-pink hover:bg-slate-50 relative transition-all duration-200 group"
            aria-label="Open Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.75] group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand-pink text-white text-[9px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-50 duration-200">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight font-medium">Cart</span>
          </button>

          {/* Track Order */}
          <Link
            href="/track-order"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-2xl transition-all duration-200 ${
              isTrack
                ? "text-brand-pink font-bold bg-pink-50/90 shadow-2xs scale-102"
                : "text-slate-600 hover:text-brand-pink hover:bg-slate-50"
            }`}
          >
            <PackageSearch className={`w-5 h-5 transition-transform ${isTrack ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            <span className="text-[10px] tracking-tight">Track</span>
          </Link>

          {/* WhatsApp Helpline */}
          <a
            href="https://wa.me/923452086160"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-2xl text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/70 transition-all duration-200"
          >
            <PhoneCall className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] tracking-tight font-semibold">WhatsApp</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
