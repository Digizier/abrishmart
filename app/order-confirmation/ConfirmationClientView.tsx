"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, PackageCheck, Phone, ShieldCheck, Home } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";
import { getOrderById } from "@/lib/db";

export default function ConfirmationClientView({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (orderId && orderId !== "ABM-SUCCESS") {
        const found = await getOrderById(orderId);
        if (found) {
          setOrder(found);
        }
      }
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center space-y-6">
      {/* Celebration Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
      </div>

      <div>
        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order Placed Successfully
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          Thank You For Shopping With Abrish Mart!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Your Cash on Delivery order has been registered in our system. We will call or WhatsApp you before dispatch.
        </p>
      </div>

      {/* Order Badge Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-left space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Reference</p>
            <p className="text-base sm:text-lg font-black text-brand-pink font-mono">{orderId}</p>
          </div>
          <span className="bg-brand-yellow/30 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg">
            Cash on Delivery
          </span>
        </div>

        {order ? (
          <div className="space-y-3 text-xs">
            <div>
              <p className="text-slate-500">Customer Name:</p>
              <p className="font-bold text-slate-900">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-slate-500">Delivery Address:</p>
              <p className="font-semibold text-slate-800">{order.address}, {order.city}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm">
              <span className="text-slate-900">Total Payable at Doorstep:</span>
              <span className="text-brand-pink text-base font-black">Rs. {order.total_amount?.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-600 space-y-1.5">
            <p><strong>Payment Mode:</strong> Cash on Delivery (COD)</p>
            <p><strong>Dispatch:</strong> Courier will collect cash at the time of parcel handover.</p>
          </div>
        )}
      </div>

      {/* WhatsApp Help Shortcut */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-800">
        <div className="flex items-center gap-2 text-left">
          <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Need immediate confirmation or order changes?</p>
            <p className="text-[11px] text-emerald-600">Contact Usman Shah on WhatsApp: 0345-2086160</p>
          </div>
        </div>
        <a
          href={`https://wa.me/923452086160?text=Salam%20Usman%20Bhai,%20I%20have%20placed%20order%20${orderId}%20on%20Abrish%20Mart.`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition shrink-0"
        >
          Message on WhatsApp
        </a>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          href="/track-order"
          className="flex items-center gap-1.5 text-xs font-bold px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
        >
          <PackageCheck className="w-4 h-4 text-brand-pink" />
          <span>Track Order</span>
        </Link>

        <Link
          href="/shop"
          className="flex items-center gap-1.5 text-xs font-bold px-6 py-3 rounded-xl bg-brand-pink hover:bg-brand-pinkHover text-white shadow-md shadow-brand-pink/20 transition"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}
