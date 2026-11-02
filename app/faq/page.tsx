import React from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How do I place an order on Abrish Mart?",
    a: "Select your desired product, choose your size/color (if applicable), and click the 'ORDER NOW – CASH ON DELIVERY' button. Enter your name, mobile number, and delivery address. Your order is confirmed immediately!",
  },
  {
    q: "Is Cash on Delivery (COD) available in my city?",
    a: "Yes! We offer Cash on Delivery across 2,700+ cities and towns in all provinces of Pakistan including Punjab, Sindh, KPK, Balochistan, and Azad Kashmir.",
  },
  {
    q: "What are the delivery charges?",
    a: "Standard delivery is Rs. 200 per order. If your cart total is Rs. 2,500 or more, you automatically receive 100% FREE DELIVERY nationwide!",
  },
  {
    q: "How long does delivery take?",
    a: "Orders in major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad) usually arrive within 2 to 4 working days. Other areas generally take 3 to 5 working days.",
  },
  {
    q: "Can I inspect the parcel before paying?",
    a: "Yes! All Abrish Mart parcels are dispatched via recognized couriers (Trax & Leopard) with permission to inspect the outer package before accepting delivery.",
  },
  {
    q: "What is your return and refund policy?",
    a: "We offer a 7-day replacement guarantee if the product received is defective, damaged, or incorrect. Simply contact us on WhatsApp at 0345-2086160.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-brand-pink">
          Help Center
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Everything you need to know about shopping, payment, and delivery at Abrish Mart.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm divide-y divide-slate-100">
        {FAQS.map((faq, i) => (
          <div key={i} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-slate-600 pl-6 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="p-6 bg-brand-softPink/60 rounded-3xl border border-brand-pink/20 text-center space-y-2">
        <h4 className="text-sm font-bold text-slate-900">Still have a question?</h4>
        <p className="text-xs text-slate-600">Usman Shah is ready to answer your questions on WhatsApp.</p>
        <a
          href="https://wa.me/923452086160"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-bold py-2.5 px-6 rounded-full shadow transition"
        >
          Chat on WhatsApp: 0345-2086160
        </a>
      </div>
    </div>
  );
}
