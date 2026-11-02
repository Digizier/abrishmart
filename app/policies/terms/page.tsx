import React from "react";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-slate-100 rounded-2xl text-slate-700">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500">Last updated: November 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-sm">1. Acceptance of Terms</h3>
        <p>
          By accessing and placing an order on Abrish Mart (abrishmart.store), you agree to be bound by these Terms and Conditions.
        </p>

        <h3 className="font-bold text-slate-900 text-sm">2. Orders and Pricing</h3>
        <p>
          All product prices are quoted in Pakistani Rupees (PKR) and include applicable taxes. We reserve the right to correct any typographical pricing errors prior to parcel dispatch.
        </p>

        <h3 className="font-bold text-slate-900 text-sm">3. Cash on Delivery Commitment</h3>
        <p>
          Customers placing COD orders agree to receive the package and provide cash payment upon delivery. Repeated parcel refusals without legitimate cause may result in suspension from COD ordering.
        </p>
      </div>
    </div>
  );
}
