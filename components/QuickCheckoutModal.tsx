"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ShieldCheck, Truck, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import { Product, OrderItem } from "@/lib/types";
import { createOrder } from "@/lib/db";

interface QuickCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
}

const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Sukkur",
  "Larkana",
  "Mardan",
  "Kasur",
  "Gujrat",
  "Other City",
];

export default function QuickCheckoutModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  selectedColor,
}: QuickCheckoutModalProps) {
  const router = useRouter();

  // Form states
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Lahore");
  const [address, setAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  // Calculation
  const subtotal = product.price * quantity;
  const deliveryCharges = subtotal >= 2500 ? 0 : 200;
  const totalPayable = Math.max(0, subtotal + deliveryCharges - discount);

  // Apply Promo Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === "SAVE500" && subtotal >= 3000) {
      setDiscount(500);
      setCouponMessage("🎉 Coupon SAVE500 applied! Rs. 500 off.");
    } else if (cleanCode === "FREESHIP") {
      setDiscount(200);
      setCouponMessage("🎉 Coupon FREESHIP applied! Free Delivery.");
    } else if (cleanCode === "ABRISH10") {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setCouponMessage(`🎉 Coupon ABRISH10 applied! Rs. ${disc} off.`);
    } else {
      setDiscount(0);
      setCouponMessage("❌ Invalid coupon code or minimum spend requirement not met.");
    }
  };

  // Submit Order
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const cleanPhone = phone.trim().replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 12) {
      setErrorMessage("Please enter a valid 11-digit mobile number (e.g. 03451234567).");
      return;
    }

    if (!address.trim()) {
      setErrorMessage("Please enter your complete delivery address.");
      return;
    }

    setIsSubmitting(true);

    const orderItem: OrderItem = {
      id: `${product.id}-${selectedSize || "std"}-${selectedColor || "std"}`,
      title: product.title,
      price: product.price,
      quantity,
      selected_size: selectedSize,
      selected_color: selectedColor,
      thumbnail_url: product.thumbnail_url,
      product_id: product.id,
      hhc_product_id: product.hhc_product_id,
      hhc_store_id: product.hhc_store_id,
    };

    const res = await createOrder({
      order_number: "",
      customer_name: fullName.trim(),
      phone: cleanPhone,
      city,
      address: address.trim(),
      items: [orderItem],
      subtotal,
      delivery_charges: deliveryCharges,
      discount,
      total_amount: totalPayable,
      payment_method: "cod",
      payment_status: "pending",
      status: "Pending",
      order_notes: orderNotes.trim(),
    });

    setIsSubmitting(false);

    if (res.success && res.order_number) {
      onClose();
      router.push(`/order-confirmation/?orderId=${res.order_number}`);
    } else {
      setErrorMessage(res.error || "Failed to confirm order. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-brand-pink to-rose-600 text-white shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-yellow" />
            <h3 className="text-sm font-bold tracking-tight">Quick Checkout — Cash on Delivery</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Selected Product Card */}
          <div className="flex gap-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-200">
              <Image
                src={product.thumbnail_url}
                alt={product.title}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{product.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  {selectedSize && (
                    <span className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">
                      Size: {selectedSize}
                    </span>
                  )}
                  {selectedColor && (
                    <span className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">
                      Color: {selectedColor}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-extrabold text-brand-pink">
                  Rs. {product.price.toLocaleString()}
                </span>
                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-0.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-0.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({quantity} items):</span>
              <span className="font-semibold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges:</span>
              <span>
                {deliveryCharges === 0 ? (
                  <strong className="text-emerald-600 uppercase font-bold">FREE (Spent &gt; Rs. 2,500)</strong>
                ) : (
                  <strong className="text-slate-900 font-semibold">Rs. {deliveryCharges}</strong>
                )}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Voucher Discount:</span>
                <span>- Rs. {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold">
              <span className="text-slate-900">Total Payable:</span>
              <span className="text-brand-pink text-base font-black">Rs. {totalPayable.toLocaleString()}</span>
            </div>
          </div>

          {/* Coupon Code Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Discount Coupon (e.g. SAVE500)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-brand-pink"
              />
              <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
            >
              Apply
            </button>
          </div>
          {couponMessage && (
            <p className={`text-xs ${couponMessage.startsWith("🎉") ? "text-emerald-600 font-semibold" : "text-rose-600"}`}>
              {couponMessage}
            </p>
          )}

          {/* Delivery Form */}
          <form onSubmit={handleConfirmOrder} className="space-y-3 pt-1">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-brand-pink" />
              <span>Customer & Delivery Details</span>
            </h5>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Muhammad Ali"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Mobile Number (WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03451234567"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Complete Delivery Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Street #, Sector / Mohalla, Area / Landmark"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Order Notes (Optional)</label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special instructions for courier"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-brand-pink to-rose-600 hover:from-brand-pinkHover hover:to-rose-700 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-brand-pink/25 transition active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CONFIRM ORDER (Rs. {totalPayable.toLocaleString()} COD)</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
