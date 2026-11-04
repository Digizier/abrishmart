"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Tag } from "lucide-react";
import { OrderItem, SiteSettings } from "@/lib/types";
import { getSiteSettings, getStoredSettings } from "@/lib/db";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQuantity: (id: string | number, qty: number) => void;
  onRemoveItem: (id: string | number) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getStoredSettings());

  useEffect(() => {
    getSiteSettings().then((s) => setSiteSettings(s));

    const handleSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettings>;
      if (customEvent.detail) setSiteSettings(customEvent.detail);
      else getSiteSettings().then((s) => setSiteSettings(s));
    };

    window.addEventListener("kb_settings_updated", handleSettingsUpdate);
    return () => window.removeEventListener("kb_settings_updated", handleSettingsUpdate);
  }, []);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = siteSettings?.free_shipping_threshold ?? 2500;
  const baseDeliveryCharge = siteSettings?.delivery_charge ?? 200;
  const deliveryCharges = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : baseDeliveryCharge;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const grandTotal = Math.max(0, subtotal + deliveryCharges - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "SAVE500" && subtotal >= 3000) {
      setDiscount(500);
      setCouponMsg("🎉 Rs. 500 discount applied!");
    } else if (code === "FREESHIP") {
      setDiscount(200);
      setCouponMsg("🎉 Free shipping discount applied!");
    } else {
      setDiscount(0);
      setCouponMsg("❌ Invalid code or minimum spend requirement not met.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-pink" />
              <h3 className="font-bold text-slate-900 text-sm">Shopping Cart ({items.length})</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-brand-softPink/60 p-3 border-b border-brand-pink/10 shrink-0">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1 font-semibold text-slate-800">
                <Truck className="w-4 h-4 text-brand-pink" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">🎉 You unlocked FREE Delivery across Pakistan!</span>
                ) : (
                  <span>
                    Add <strong className="text-brand-pink">Rs. {remainingForFreeShipping.toLocaleString()}</strong> more for Free Shipping
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-pink h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Your cart is empty</h4>
                  <p className="text-xs text-slate-500 mt-1">Explore our hot deals and popular products.</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-brand-pink text-white text-xs font-bold py-2.5 px-6 rounded-full shadow hover:bg-brand-pinkHover transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 group">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src={item.thumbnail_url}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{item.title}</h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        {item.selected_size && <span>Size: {item.selected_size}</span>}
                        {item.selected_color && <span>• Color: {item.selected_color}</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-brand-pink">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-300 rounded-md bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0 space-y-3">
              {/* Voucher Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon Code"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs uppercase focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Apply
                </button>
              </form>
              {couponMsg && (
                <p className={`text-[11px] ${couponMsg.startsWith("🎉") ? "text-emerald-600 font-medium" : "text-rose-600"}`}>
                  {couponMsg}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges:</span>
                  <span>
                    {deliveryCharges === 0 ? (
                      <strong className="text-emerald-600 font-bold">FREE</strong>
                    ) : (
                      <span className="font-semibold text-slate-900">Rs. {deliveryCharges}</span>
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>- Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold">
                  <span className="text-slate-900">Total:</span>
                  <span className="text-brand-pink text-base font-black">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full bg-brand-pink hover:bg-brand-pinkHover text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-brand-pink/25 flex items-center justify-center gap-2 transition active:scale-[0.99]"
              >
                <span>ORDER NOW — CASH ON DELIVERY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
