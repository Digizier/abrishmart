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
  Sparkles,
  FileText,
  Check,
} from "lucide-react";
import { Product } from "@/lib/types";
import { getProductBySlug, getProducts } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

// Helpers to clean and parse HHC & Quill rich HTML safely
function cleanHtmlDescription(rawHtml: string): string {
  if (!rawHtml) return "";
  return rawHtml
    .replace(/<span class=["']ql-ui["'][^>]*>.*?<\/span>/gi, "")
    .replace(/<span[^>]*class=["']ql-[^"']*["'][^>]*>.*?<\/span>/gi, "")
    .replace(/<h[1-6]>\s*(<br\s*\/?>)?\s*<\/h[1-6]>/gi, "")
    .replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "")
    .replace(/data-list=["'][^"']*["']/gi, "")
    .trim();
}

function extractPlainTextExcerpt(rawHtml: string, maxLen: number = 220): string {
  if (!rawHtml) return "";
  const firstP = rawHtml.match(/<p>([\s\S]*?)<\/p>/i);
  const source = firstP ? firstP[1] : rawHtml;
  const stripped = source.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (stripped.length <= maxLen) return stripped;
  return stripped.slice(0, maxLen).trim() + "...";
}

function extractFeatureBulletPoints(rawHtml: string): string[] {
  if (!rawHtml) return [];
  const matches = rawHtml.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
  if (!matches) return [];
  return matches
    .map((li) => li.replace(/<[^>]+>/g, "").trim())
    .filter((t) => t.length > 2);
}

function isHtmlContent(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str || "");
}

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

  const isHtml = isHtmlContent(product.description);
  const cleanHtml = cleanHtmlDescription(product.description);
  const bulletFeatures = extractFeatureBulletPoints(product.description);
  const plainExcerpt = extractPlainTextExcerpt(product.description);

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
        <Link href={`/category/?slug=${product.category_slug}`} className="hover:text-brand-pink capitalize">
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

          {/* Product Summary / Excerpt */}
          <div className="border-y border-slate-100 py-3.5 space-y-2">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHtml ? plainExcerpt : product.description}
            </p>
            {isHtml && (
              <a
                href="#product-details"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-pink hover:text-brand-pinkHover hover:underline transition"
              >
                <span>Full specifications & key features below ↓</span>
              </a>
            )}
          </div>

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

      {/* ========================================================
          FULL SPECIFICATIONS & KEY FEATURES SECTION
      ======================================================== */}
      <section id="product-details" className="pt-8 sm:pt-12 border-t border-slate-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-softPink flex items-center justify-center text-brand-pink shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-slate-900">
                Product Details & Specifications
              </h2>
              <p className="text-xs text-slate-500">
                100% genuine product with open-parcel Cash on Delivery verification across Pakistan
              </p>
            </div>
          </div>

          {/* Key Feature Cards */}
          {bulletFeatures.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Key Features & Highlights</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {bulletFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium hover:bg-pink-50/40 transition"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clean Rich Description Content */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Full Overview</span>
            </h3>
            {isHtml ? (
              <div
                className="prose prose-sm max-w-none text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-slate-900 [&_p]:mb-2.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_li]:leading-normal [&_strong]:font-bold [&_strong]:text-slate-900"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            ) : (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            )}
          </div>

          {/* Customer Assurance Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Truck className="w-5 h-5 text-brand-pink shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">Nationwide Delivery</p>
                <p className="text-[11px] text-slate-500">2-4 Days via Trax & Leopard</p>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">Open Parcel Allowed</p>
                <p className="text-[11px] text-slate-500">Inspect before paying courier</p>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Phone className="w-5 h-5 text-sky-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">Dedicated Support</p>
                <p className="text-[11px] text-slate-500">WhatsApp: 0345-2086160</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
