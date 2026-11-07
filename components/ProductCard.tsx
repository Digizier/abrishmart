"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Zap } from "lucide-react";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onQuickOrder: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onQuickOrder, onAddToCart }: ProductCardProps) {
  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 hover:border-brand-pink/30 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Discount Badge & Flash Tag */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
        {discountPercent && (
          <span className="bg-brand-pink text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.is_flash_deal && (
          <span className="bg-brand-yellow text-slate-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
            <Zap className="w-2.5 h-2.5 fill-slate-900" />
            <span>DEAL</span>
          </span>
        )}
      </div>

      {/* Product Image Link */}
      <Link
        href={`/product/?slug=${encodeURIComponent(product.slug)}`}
        className="relative aspect-square w-full bg-slate-50 overflow-hidden block"
      >
        <Image
          src={product.thumbnail_url}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition duration-300"
          unoptimized
        />
      </Link>

      {/* Card Content - Compact & Balanced */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          {/* Rating & Stock */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{product.rating || 4.8}</span>
              <span className="text-slate-400">({product.reviews_count || 12})</span>
            </div>
            {product.stock > 0 ? (
              <span className="text-emerald-600 font-semibold text-[9px]">In Stock</span>
            ) : (
              <span className="text-rose-500 font-semibold text-[9px]">Sold Out</span>
            )}
          </div>

          {/* Product Title - Strict 2-line clamp */}
          <Link href={`/product/?slug=${encodeURIComponent(product.slug)}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 hover:text-brand-pink transition leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-1.5 mt-auto border-t border-slate-100 flex flex-col gap-2">
          {/* Price row */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-brand-pink">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                Rs. {product.original_price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Buttons: 50% Order Now + 50% Add to Cart (Equal Ratio - Strict Single Line) */}
          <div className="grid grid-cols-2 gap-1 pt-1">
            <button
              type="button"
              onClick={() => onQuickOrder(product)}
              className="w-full bg-brand-pink hover:bg-brand-pinkHover text-white text-[10px] 2xl:text-[11px] font-extrabold py-2 px-1 rounded-lg sm:rounded-xl shadow-xs transition active:scale-[0.98] flex items-center justify-center gap-0.5 whitespace-nowrap overflow-hidden"
            >
              <Zap className="w-2.5 h-2.5 fill-white shrink-0 hidden 2xl:inline" />
              <span>Order Now</span>
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="w-full bg-slate-100 hover:bg-brand-softPink text-slate-800 hover:text-brand-pink border border-slate-200/90 hover:border-brand-pink/40 text-[10px] 2xl:text-[11px] font-extrabold py-2 px-1 rounded-lg sm:rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-0.5 whitespace-nowrap overflow-hidden"
            >
              <ShoppingBag className="w-2.5 h-2.5 shrink-0" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
