"use client";

import React, { useRef, useState, useEffect } from "react";
import { ShieldCheck, Truck, RotateCcw, Clock, Award, CheckCircle } from "lucide-react";

const BRAND_PROMISES = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
    subtitle: "Verified Quality Inspection",
  },
  {
    icon: Truck,
    title: "Cash On Delivery (COD)",
    subtitle: "Pay At Your Doorstep",
  },
  {
    icon: Award,
    title: "Express Nationwide Dispatch",
    subtitle: "Trax & Leopard Couriers",
  },
  {
    icon: RotateCcw,
    title: "7-Day Replacement",
    subtitle: "Hassle-Free Return Policy",
  },
  {
    icon: Clock,
    title: "24/7 WhatsApp Support",
    subtitle: "0345-2086160 Direct Line",
  },
  {
    icon: CheckCircle,
    title: "Secure Discretion Packaging",
    subtitle: "Confidential & Safe Delivery",
  },
];

export default function BrandsMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let animationFrameId: number;
    let scrollPos = el.scrollLeft;

    const step = () => {
      if (!isPaused && el) {
        scrollPos += 0.5; // continuous smooth motion
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  // Duplicate for infinite continuous ticker
  const displayItems = [...BRAND_PROMISES, ...BRAND_PROMISES];

  return (
    <section className="py-6 sm:py-8 bg-slate-900 text-white overflow-hidden border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-yellow animate-ping" />
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300">
            Authorized Brands & Genuine Quality Standards
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 hidden sm:inline">Pakistan-wide Service</span>
      </div>

      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.title}-${idx}`}
              className="flex-shrink-0 flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-3 transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-pink/20 text-brand-pink flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">{item.title}</p>
                <p className="text-[10px] text-slate-400 whitespace-nowrap">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
