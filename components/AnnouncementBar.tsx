"use client";

import React from "react";
import { Phone, Truck, ShieldCheck } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-brand-navy text-white text-xs py-2 px-3 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Free delivery badge */}
        <div className="flex items-center gap-1.5 font-medium truncate">
          <Truck className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
          <span className="truncate">
            <strong className="text-brand-yellow">FREE Delivery</strong> across Pakistan on orders above Rs. 2,500!
          </span>
        </div>

        {/* Right: Cash on Delivery & Helpline */}
        <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-300">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cash on Delivery (COD)</span>
          </div>
          <a
            href="https://wa.me/923452086160"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-brand-yellow transition"
          >
            <Phone className="w-3.5 h-3.5 text-brand-yellow" />
            <span>0345-2086160</span>
          </a>
        </div>
      </div>
    </div>
  );
}
