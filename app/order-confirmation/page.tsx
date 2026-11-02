"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ConfirmationClientView from "./ConfirmationClientView";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId =
    searchParams.get("orderId") ||
    searchParams.get("id") ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("abm_last_order_id") || "ABM-SUCCESS"
      : "ABM-SUCCESS");

  return <ConfirmationClientView orderId={orderId} />;
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading order confirmation...</p>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
