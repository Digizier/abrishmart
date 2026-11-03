"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ShieldCheck, Truck, Headphones, RotateCcw } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      {/* 4 Feature Badges */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-brand-yellow shrink-0" />
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">Free Delivery</h4>
                <p className="text-[11px] text-slate-400">On all orders above Rs. 2,500</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">Cash on Delivery</h4>
                <p className="text-[11px] text-slate-400">Pay when your parcel arrives</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RotateCcw className="w-8 h-8 text-brand-pink shrink-0" />
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">7 Days Return</h4>
                <p className="text-[11px] text-slate-400">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Headphones className="w-8 h-8 text-sky-400 shrink-0" />
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">WhatsApp Support</h4>
                <p className="text-[11px] text-slate-400">0345-2086160 (9 AM - 10 PM)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Column 1: Store Intro */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <div className="relative h-11 w-44">
                <Image
                  src="/images/logo/logo-text.png"
                  alt="Abrish Mart"
                  fill
                  className="object-contain object-left brightness-110"
                  unoptimized
                />
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your trusted multi-category Pakistani online shopping destination. Delivering premium bridal silk nightwear, educational toys, watches, and smart lifestyle products at unbeatable prices.
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Tax ID / NTN: 4250192695085
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Explore Store
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="hover:text-brand-pink transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/?slug=bridal-silk-nightwear" className="hover:text-brand-pink transition">
                  Bridal Silk & Nightwear
                </Link>
              </li>
              <li>
                <Link href="/category/?slug=kids-educational-toys" className="hover:text-brand-pink transition">
                  Kids & Educational Toys
                </Link>
              </li>
              <li>
                <Link href="/category/?slug=fashion-watches" className="hover:text-brand-pink transition">
                  Fashion Watches & Accessories
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-brand-yellow font-semibold hover:underline">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Customer Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/policies/shipping" className="hover:text-brand-pink transition">
                  Shipping & Delivery Coverage
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-brand-pink transition">
                  Returns & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-brand-pink transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-brand-pink transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-pink transition">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Payment Methods */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Official Helpline
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/923452086160" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  0345-2086160 (Call / WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-pink shrink-0" />
                <a href="mailto:usmanshah11@gmail.com" className="hover:text-white transition">
                  usmanshah11@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-yellow shrink-0" />
                <span>Online Warehouse — Delivery Across All Pakistan</span>
              </li>
            </ul>

            {/* Payment Badges */}
            <div className="pt-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">
                Supported Payment Options
              </p>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                  Cash on Delivery (COD)
                </span>
                <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded">
                  JazzCash
                </span>
                <span className="bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded">
                  EasyPaisa
                </span>
                <span className="bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded">
                  Bank Transfer
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Abrish Mart. All rights reserved. Shop Smart, Save More!</p>
          <p className="text-[10px]">Designed & Engineered for Lightning Fast Edge Delivery.</p>
        </div>
      </div>
    </footer>
  );
}
