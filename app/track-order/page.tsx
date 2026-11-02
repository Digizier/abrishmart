"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PackageSearch, Search, AlertCircle, CheckCircle2, Clock, Truck, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";

const STATUS_STEPS = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setOrder(null);

    const cleanOrderNo = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, "");

    if (!cleanOrderNo || !cleanPhone) {
      setErrorMsg("Please enter both your Order Number and Mobile Number.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, customer_name, phone, city, address, items, subtotal, delivery_charges, total_amount, status, tracking_number, courier_name, created_at")
        .eq("order_number", cleanOrderNo)
        .maybeSingle();

      if (error || !data) {
        setErrorMsg("No matching order found. Please check your Order Number and Phone Number.");
      } else {
        // Verify phone matches (last 4 digits match for privacy)
        const dbPhone = data.phone?.replace(/[^0-9]/g, "");
        if (dbPhone && !dbPhone.endsWith(cleanPhone.slice(-4))) {
          setErrorMsg("Phone number does not match the order record.");
        } else {
          setOrder(data as Order);
        }
      }
    } catch {
      setErrorMsg("Failed to query order tracking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <PackageSearch className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900">
          Track Your Abrish Mart Parcel
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Enter your Order Number and Mobile Number to view live dispatch status across Pakistan.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Order Number *
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. ABM-849201"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03451234567"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-pink hover:bg-brand-pinkHover text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? "Searching..." : "Track My Order"}</span>
          </button>
        </form>
      </div>

      {/* Result Display */}
      {order && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Order Details</span>
              <h3 className="text-base font-black text-slate-900">{order.order_number}</h3>
            </div>
            <span className="bg-brand-softPink text-brand-pink border border-brand-pink/20 text-xs font-extrabold px-3 py-1 rounded-full self-start sm:self-auto">
              Status: {order.status}
            </span>
          </div>

          {/* Progress Timeline */}
          <div className="py-2">
            <div className="relative flex items-center justify-between">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;
                return (
                  <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isPassed
                          ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                          : "bg-slate-200 text-slate-500"
                      } ${isCurrent ? "ring-4 ring-brand-pink/20" : ""}`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-700 mt-1.5 text-center">
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Details */}
          {order.tracking_number && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-900">Courier Dispatch</p>
                <p className="text-emerald-700 mt-0.5">
                  Courier: <strong>{order.courier_name || "Trax Logistics"}</strong> | Tracking #: <strong>{order.tracking_number}</strong>
                </p>
              </div>
              <Truck className="w-6 h-6 text-emerald-600" />
            </div>
          )}

          {/* Itemized Info */}
          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
            <p><strong>Customer:</strong> {order.customer_name}</p>
            <p><strong>Destination:</strong> {order.address}, {order.city}</p>
            <p><strong>Total Payable:</strong> Rs. {order.total_amount?.toLocaleString()} (Cash on Delivery)</p>
          </div>
        </div>
      )}
    </div>
  );
}
