"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-brand-pink">
          Customer Support
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          Contact Abrish Mart
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Have a question about an order, delivery time, or product variation? Reach out to us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-base font-black text-slate-900">Direct Inquiries</h2>
          <ul className="space-y-4 text-xs text-slate-600">
            <li className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Call & WhatsApp Hotline</p>
                <a href="https://wa.me/923452086160" className="text-emerald-700 font-bold hover:underline">
                  0345-2086160
                </a>
                <p className="text-[11px] text-slate-400 mt-0.5">Mon to Sat: 9:00 AM – 10:00 PM</p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-brand-softPink text-brand-pink shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Email Address</p>
                <a href="mailto:usmanshah11@gmail.com" className="text-brand-pink hover:underline">
                  usmanshah11@gmail.com
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Warehouse Location</p>
                <p>Online Fulfillment Center — Delivering Across All Cities of Pakistan</p>
              </div>
            </li>
          </ul>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800">
            <p className="font-bold">Fastest Response:</p>
            <p className="mt-0.5">Send us a message on WhatsApp with your Order ID for instant assistance.</p>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">Message Sent!</h3>
              <p className="text-xs text-slate-600">
                Thank you for contacting Abrish Mart. Usman Shah will reply to your inquiry shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="font-black text-slate-900 text-sm">Send a Quick Message</h3>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Khan"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="03451234567"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message / Question *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="How can we help you?"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-pink hover:bg-brand-pinkHover text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
