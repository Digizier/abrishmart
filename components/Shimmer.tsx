"use client";

import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col animate-pulse">
      {/* Thumbnail shimmer */}
      <div className="aspect-square w-full bg-slate-200/80 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* Content shimmer */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
        <div className="space-y-1.5">
          <div className="h-3 bg-slate-200 rounded w-1/3" />
          <div className="h-3.5 bg-slate-200 rounded w-5/6" />
          <div className="h-3.5 bg-slate-200 rounded w-2/3" />
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="h-4 bg-slate-200 rounded w-16" />
          <div className="h-8 bg-slate-200 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
