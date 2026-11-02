"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle, Home, Building2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/db";
import { compressAndUploadImage } from "@/lib/image-compress";

const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Bahawalpur", "Sargodha", "Abbottabad", "Other"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [addressType, setAddressType] = useState<"home" | "office">("home");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Lahore");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "jazzcash" | "easypaisa" | "bank">("cod");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharges = subtotal >= 2500 || cart.length === 0 ? 0 : 200;
  const grandTotal = subtotal + deliveryCharges;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add products to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="inline-block bg-brand-pink text-white text-xs font-bold py-2.5 px-6 rounded-full shadow">
          Explore Products
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage("Please complete all required fields (Name, Phone, Address).");
      return;
    }

    setIsSubmitting(true);

    let paymentProofUrl = null;
    if (paymentMethod !== "cod" && proofFile) {
      setUploadingProof(true);
      const uploadRes = await compressAndUploadImage(proofFile, "abrishmart-media");
      paymentProofUrl = uploadRes.url;
      setUploadingProof(false);
    }

    const orderRes = await createOrder({
      order_number: "",
      customer_name: fullName.trim(),
      phone: phone.trim(),
      city,
      address: `[${addressType.toUpperCase()}] ${address.trim()}`,
      items: cart,
      subtotal,
      delivery_charges: deliveryCharges,
      discount: 0,
      total_amount: grandTotal,
      payment_method: paymentMethod,
      payment_status: paymentMethod === "cod" ? "pending" : "pending",
      payment_proof_url: paymentProofUrl,
      status: "Pending",
      order_notes: notes.trim(),
    });

    setIsSubmitting(false);

    if (orderRes.success && orderRes.order_number) {
      clearCart();
      router.push(`/order-confirmation/${orderRes.order_number}`);
    } else {
      setErrorMessage(orderRes.error || "Failed to submit order. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-pink mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Continue Shopping</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer Information & Delivery Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">Delivery Information</h2>
            <p className="text-xs text-slate-500">Provide your shipping address for Cash on Delivery parcel dispatch.</p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            {/* Address Type Selector Cards */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAddressType("home")}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
                  addressType === "home"
                    ? "border-brand-pink bg-brand-softPink text-brand-pink"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setAddressType("office")}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
                  addressType === "office"
                    ? "border-brand-pink bg-brand-softPink text-brand-pink"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Office / Commercial</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Usman Shah"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03451234567"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Complete Street Address *</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Street #, Mohalla / Sector, Famous Landmark"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Order Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special delivery instructions"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700"
              />
            </div>

            {/* Payment Method Accordion */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">Select Payment Method</h3>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  paymentMethod === "cod" ? "border-brand-pink bg-brand-softPink" : "border-slate-200 hover:bg-slate-50"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="text-brand-pink focus:ring-brand-pink"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-slate-500">Pay cash directly to courier at your doorstep.</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  paymentMethod === "jazzcash" ? "border-brand-pink bg-brand-softPink" : "border-slate-200 hover:bg-slate-50"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "jazzcash"}
                    onChange={() => setPaymentMethod("jazzcash")}
                    className="text-brand-pink focus:ring-brand-pink"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">JazzCash (Advance Transfer)</p>
                    <p className="text-[11px] text-slate-500">Account: 0345-2086160 (Usman Shah)</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  paymentMethod === "easypaisa" ? "border-brand-pink bg-brand-softPink" : "border-slate-200 hover:bg-slate-50"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "easypaisa"}
                    onChange={() => setPaymentMethod("easypaisa")}
                    className="text-brand-pink focus:ring-brand-pink"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">EasyPaisa (Advance Transfer)</p>
                    <p className="text-[11px] text-slate-500">Account: 0345-2086160 (Usman Shah)</p>
                  </div>
                </label>
              </div>

              {/* Payment Proof Upload for Non-COD */}
              {paymentMethod !== "cod" && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Upload Payment Transfer Screenshot (Receipt)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-pink file:text-white hover:file:bg-brand-pinkHover cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">Image will be auto-compressed to WebP format for fast upload.</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || uploadingProof}
              className="w-full mt-4 bg-brand-pink hover:bg-brand-pinkHover text-white font-black text-sm py-4 px-6 rounded-xl shadow-xl shadow-brand-pink/25 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {isSubmitting ? "Placing Order..." : `PLACE ORDER (Rs. ${grandTotal.toLocaleString()})`}
              </span>
            </button>
          </form>
        </div>

        {/* Right: Order Items Summary */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
            Order Summary ({cart.length} items)
          </h3>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <Image src={item.thumbnail_url} alt={item.title} fill sizes="56px" className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Qty: {item.quantity} {item.selected_size && `• Size: ${item.selected_size}`}
                  </p>
                  <p className="text-xs font-extrabold text-brand-pink mt-1">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
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
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black">
              <span className="text-slate-900">Total Payable:</span>
              <span className="text-brand-pink text-base font-black">Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
