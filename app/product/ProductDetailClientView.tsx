"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Phone,
  Share2,
  CheckCircle2,
  Home,
  MessageCircle,
} from "lucide-react";
import { Product } from "@/lib/types";
import { getProductBySlug, getProducts } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailClientView({ slug }: { slug: string }) {
  const { openQuickCheckout, addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const prod = await getProductBySlug(slug);
      if (prod) {
        setProduct(prod);
        setSelectedImage(prod.thumbnail_url);
        if (prod.variations?.sizes?.length) {
          setSelectedSize(prod.variations.sizes[0]);
        }
        if (prod.variations?.colors?.length) {
          setSelectedColor(prod.variations.colors[0]);
        }

        // Fetch related products from same category
        const rel = await getProducts({ category: prod.category_slug, limit: 4 });
        setRelated(rel.products.filter((p) => p.slug !== prod.slug));
      }
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for might have been moved or removed.</p>
        <Link
          href="/shop"
          className="inline-block bg-brand-pink text-white text-xs font-bold py-2.5 px-6 rounded-full shadow"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  const imagesList = Array.from(new Set([product.thumbnail_url, ...(product.gallery_urls || [])].filter(Boolean)));

  const productUrl = typeof window !== "undefined" ? window.location.href : `https://abrishmart.store/product/?slug=${product.slug}`;
  const whatsappShareText = encodeURIComponent(
    `Check out ${product.title} on Abrish Mart for Rs. ${product.price.toLocaleString()}: ${productUrl}`
  );
  const whatsappEnquiryText = encodeURIComponent(
    `Salam Usman Bhai, I want to inquire about "${product.title}" (SKU: ${product.sku || "N/A"}) on Abrish Mart.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-pink flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href={`/category/${product.category_slug}`} className="hover:text-brand-pink capitalize">
          {product.category_slug.replace(/-/g, " ")}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-3 sm:space-y-4">
          {/* Main Featured Image */}
          <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm">
            {discountPercent && (
              <span className="absolute top-3 left-3 z-10 bg-brand-pink text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                SAVE {discountPercent}%
              </span>
            )}
            <Image
              src={selectedImage || product.thumbnail_url}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Thumbnails Row */}
          {imagesList.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {imagesList.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImage === img ? "border-brand-pink shadow-md scale-105" : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <Image src={img} alt={`Gallery view ${i + 1}`} fill sizes="80px" className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Purchase Actions */}
        <div className="space-y-5">
          <div>
            {/* Rating & SKU */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-500">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-800">{product.rating}</span>
                <span className="text-slate-400">({product.reviews_count} Customer Reviews)</span>
              </div>
              {product.sku && <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">SKU: {product.sku}</span>}
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl sm:text-3xl font-black text-brand-pink">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm sm:text-base text-slate-400 line-through">
                  Rs. {product.original_price.toLocaleString()}
                </span>
              )}
              {discountPercent && (
                <span className="text-xs bg-brand-softPink text-brand-pink font-bold px-2 py-0.5 rounded-full border border-brand-pink/20">
                  Save Rs. {(product.original_price! - product.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-y border-slate-100 py-3">
            {product.description}
          </p>

          {/* Variations: Size Selector */}
          {product.variations?.sizes && product.variations.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Select Size:</span>
                <span className="text-brand-pink font-semibold">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variations.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      selectedSize === s
                        ? "border-brand-pink bg-brand-softPink text-brand-pink shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variations: Color Selector */}
          {product.variations?.colors && product.variations.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Select Color:</span>
                <span className="text-brand-pink font-semibold">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variations.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      selectedColor === c
                        ? "border-brand-pink bg-brand-softPink text-brand-pink shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-800">Quantity:</span>
            <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 font-bold"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-bold text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 font-bold"
              >
                +
              </button>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Available in Stock</span>
            </span>
          </div>

          {/* TWO PROMINENT BUTTONS: ORDER NOW (Primary) & ADD TO CART (Secondary) */}
          <div className="space-y-2.5 pt-2">
            {/* Primary: Quick Checkout Button */}
            <button
              type="button"
              onClick={() => openQuickCheckout(product, selectedSize, selectedColor)}
              className="w-full bg-gradient-to-r from-brand-pink to-rose-600 hover:from-brand-pinkHover hover:to-rose-700 text-white font-black text-sm py-4 px-6 rounded-2xl shadow-xl shadow-brand-pink/30 flex items-center justify-center gap-2 transition active:scale-[0.99]"
            >
              <Zap className="w-5 h-5 fill-brand-yellow text-brand-yellow" />
              <span>ORDER NOW — CASH ON DELIVERY</span>
            </button>

            {/* Secondary: Add to Cart Button */}
            <button
              type="button"
              onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
              className="w-full bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <ShoppingBag className="w-4 h-4 text-brand-pink" />
              <span>ADD TO CART</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Truck className="w-4 h-4 text-brand-pink shrink-0" />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Genuine Quality</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
              <span>7 Days Easy Return</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-sky-600 shrink-0" />
              <span>WhatsApp: 0345-2086160</span>
            </div>
          </div>

          {/* Social Share & WhatsApp Enquiry */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-500">
              <Share2 className="w-4 h-4" />
              <span className="font-semibold">Share Product:</span>
              <a
                href={`https://wa.me/?text=${whatsappShareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded font-bold transition"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded font-bold transition"
              >
                Facebook
              </a>
            </div>

            <a
              href={`https://wa.me/923452086160?text=${whatsappEnquiryText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-700 font-bold hover:underline"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask Usman on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-4 sm:mb-6">
            Frequently Bought Together / Related Products
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {related.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickOrder={(p) => openQuickCheckout(p)}
                onAddToCart={(p) => addToCart(p)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
