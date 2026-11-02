"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Category } from "@/lib/types";

interface TopCategoriesMarqueeProps {
  categories: Category[];
}

export default function TopCategoriesMarquee({ categories }: TopCategoriesMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Filter only main categories designated for homepage
  const mainCategories = categories.filter(
    (c) => (!c.parent_slug || c.parent_slug === "") && c.show_on_homepage !== false
  );

  const shouldAutoScroll = mainCategories.length > 4;

  // Continuous smooth auto-scrolling
  useEffect(() => {
    if (!shouldAutoScroll) return;

    const el = containerRef.current;
    if (!el) return;

    let animationFrameId: number;
    let scrollPos = el.scrollLeft;

    const step = () => {
      if (!isPaused && el) {
        scrollPos += 0.6; // smooth gentle speed
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, shouldAutoScroll]);

  if (mainCategories.length === 0) return null;

  // Duplicate items for seamless continuous looping if scrolling
  const displayList = shouldAutoScroll ? [...mainCategories, ...mainCategories] : mainCategories;

  return (
    <section className="py-6 sm:py-10 bg-gradient-to-b from-white to-slate-50 border-y border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-pink">
              Curated Collections
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Main Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-xs font-bold text-brand-pink hover:text-brand-pinkHover transition group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* Carousel / Marquee Container */}
        {/* On mobile: shows ~2.5 cards peeking (w-[40vw] / min-w-[140px]) */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className={`flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 ${
            !shouldAutoScroll ? "sm:grid sm:grid-cols-4 lg:grid-cols-5" : ""
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayList.map((cat, idx) => (
            <Link
              key={`${cat.slug}-${idx}`}
              href={`/category/${cat.slug}`}
              className="flex-shrink-0 w-[40vw] sm:w-48 lg:w-56 group bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-brand-pink/40 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center"
            >
              {/* Category Circle Image */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-brand-softPink/60 p-1 mb-2.5 border-2 border-white shadow-inner group-hover:scale-105 transition duration-300">
                <Image
                  src={cat.image_url || "/images/banners/hero-banner.png"}
                  alt={cat.name}
                  fill
                  sizes="112px"
                  className="object-cover rounded-full"
                  unoptimized
                />
              </div>

              {/* Category Name */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-pink transition line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-0.5 group-hover:text-brand-pink/70">
                <span>Browse Products</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
