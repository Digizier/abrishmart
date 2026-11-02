import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Clock, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-brand-pink">
          Our Brand Story
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          About Abrish Mart
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Shop Smart, Save More! Serving customers across all provinces of Pakistan with genuine products and dependable Cash on Delivery.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p>
          Founded by <strong>Usman Shah</strong>, <strong>Abrish Mart</strong> was built on a simple promise: providing Pakistani households with high-quality, authentic multi-category products without the premium price tags or online shopping risks.
        </p>
        <p>
          From luxury bridal satin silk nightwear and cozy loungewear to Montessori educational toys for kids, designer watches, and smart electronic gadgets, every single item in our catalog is carefully inspected for quality before it leaves our dispatch warehouse.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Cash on Delivery (COD)</span>
            </div>
            <p className="text-xs text-slate-500">
              Zero advance payment anxiety. Inspect your parcel when it arrives and pay the courier directly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Truck className="w-5 h-5 text-brand-pink" />
              <span>Nationwide Coverage</span>
            </div>
            <p className="text-xs text-slate-500">
              Partnered with Trax Logistics and Leopard Courier covering 2,700+ cities and tehsils across Pakistan.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-bold text-slate-900">NTN / Tax Registration: 4250192695085</p>
            <p className="text-slate-500">Helpline: 0345-2086160 | Email: usmanshah11@gmail.com</p>
          </div>
          <Link
            href="/shop"
            className="bg-brand-pink hover:bg-brand-pinkHover text-white font-bold py-2.5 px-6 rounded-full shadow transition"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
