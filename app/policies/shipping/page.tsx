import React from "react";
import Link from "next/link";
import { Truck } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-softPink rounded-2xl text-brand-pink">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-slate-500">Last updated: November 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-sm">1. Nationwide Courier Partners</h3>
        <p>
          Abrish Mart partners with Pakistan&apos;s leading logistics networks (Trax Logistics and Leopard Courier) to guarantee safe and timely delivery to your doorstep across 2,700+ destinations.
        </p>

        <h3 className="font-bold text-slate-900 text-sm">2. Delivery Charges & Free Shipping</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Orders under Rs. 2,500:</strong> Flat standard delivery fee of Rs. 200.</li>
          <li><strong>Orders of Rs. 2,500 or more:</strong> 100% FREE SHIPPING across all of Pakistan.</li>
        </ul>

        <h3 className="font-bold text-slate-900 text-sm">3. Estimated Delivery Times</h3>
        <p>
          - <strong>Major Cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan):</strong> 2 to 4 working days.<br />
          - <strong>Other Cities & Rural Tehsils:</strong> 3 to 5 working days.
        </p>

        <h3 className="font-bold text-slate-900 text-sm">4. Cash on Delivery (COD) Inspection</h3>
        <p>
          You pay the exact invoice amount to the courier rider upon delivery. Please ensure your mobile number is active so the courier rider can contact you before attempting delivery.
        </p>
      </div>
    </div>
  );
}
