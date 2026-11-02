"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@/lib/types";

interface BannersHubSliderProps {
  banners: Banner[];
}

export default function BannersHubSlider({ banners }: BannersHubSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 group">
      {/* Aspect Ratio Container (Ultra responsive 2048x768 = ~2.66:1 desktop, 16:9 mobile) */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[2.66/1]">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Link href={banner.link_url || "/shop"} className="block relative w-full h-full">
                <Image
                  src={banner.image_url}
                  alt={banner.title || "Abrish Mart Promotional Banner"}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                  unoptimized
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Visible on Hover if > 1 banner) */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition"
            aria-label="Previous Banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition"
            aria-label="Next Banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {banners.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                className={`transition-all rounded-full ${
                  dotIdx === currentIndex
                    ? "w-6 sm:w-8 h-2 bg-brand-pink shadow"
                    : "w-2 h-2 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
