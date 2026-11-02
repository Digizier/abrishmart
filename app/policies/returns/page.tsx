import React from "react";
import { RotateCcw } from "lucide-react";

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
          <RotateCcw className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Returns & Refund Policy
          </h1>
          <p className="text-xs text-slate-500">Last updated: November 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-sm">7-Day Hassle-Free Replacement Guarantee</h3>
        <p>
          At Abrish Mart, customer trust is our highest priority. If you receive a product that is damaged, defective, or different from what you ordered, you are eligible for an immediate replacement within 7 days of delivery.
        </p>

        <h3 className="font-bold text-slate-900 text-sm">Eligibility Criteria</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>The return request must be submitted within 7 days of parcel receipt.</li>
          <li>The item must be in its original packaging with tags intact.</li>
          <li>For intimates and bridal nightwear, items must be unworn and unwashed for hygiene reasons.</li>
        </ul>

        <h3 className="font-bold text-slate-900 text-sm">How to Request a Return or Replacement</h3>
        <p>
          Simply message Usman Shah on WhatsApp at <strong>0345-2086160</strong> with your Order Number and photos/video of the issue. Our team will verify and dispatch a replacement.
        </p>
      </div>
    </div>
  );
}
