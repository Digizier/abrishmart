"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ShoppingBag, Loader2 } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("Redirecting...");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.includes("/order-confirmation")) {
        setIsRedirecting(true);
        setRedirectMessage("Finalizing Your Order Confirmation...");
        const parts = path.split("/").filter(Boolean);
        const orderId = parts.length > 1 ? parts[parts.length - 1] : "";
        const target =
          orderId && orderId !== "order-confirmation"
            ? `/order-confirmation/?orderId=${encodeURIComponent(orderId)}`
            : "/order-confirmation/";
        window.location.replace(target);
        return;
      }

      if (path.startsWith("/product/")) {
        setIsRedirecting(true);
        setRedirectMessage("Loading Product Details...");
        const slug = path.replace(/^\/product\//, "").replace(/\/$/, "");
        if (slug) {
          window.location.replace(`/product/?slug=${encodeURIComponent(slug)}`);
          return;
        }
      }
    }
  }, [router]);

  if (isRedirecting) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-pink animate-spin mx-auto" />
        <h2 className="text-base font-bold text-slate-800">{redirectMessage}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-4">
      <span className="text-4xl sm:text-5xl font-black text-brand-pink">404</span>
      <h1 className="text-xl sm:text-2xl font-black text-slate-900">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved. Explore our catalog to find trending products!
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-pink hover:bg-brand-pinkHover text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Home className="w-4 h-4" />
          <span>Go to Home</span>
        </Link>
        <Link
          href="/shop"
          className="flex items-center gap-1.5 px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Shop</span>
        </Link>
      </div>
    </div>
  );
}
