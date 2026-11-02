import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Last updated: November 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-sm">Customer Data Protection</h3>
        <p>
          Abrish Mart values your privacy. We collect customer shipping information (Full Name, Phone Number, Delivery Address, City) strictly for the purpose of fulfilling your order and dispatching courier consignments.
        </p>
        <p>
          We do NOT sell, rent, or lease customer data to third-party marketing companies. All transactional records are securely stored on our private encrypted databases.
        </p>
        <h3 className="font-bold text-slate-900 text-sm">Contact Information</h3>
        <p>
          If you have questions regarding your data, contact us at <strong>usmanshah11@gmail.com</strong> or WhatsApp <strong>0345-2086160</strong>.
        </p>
      </div>
    </div>
  );
}
