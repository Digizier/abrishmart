"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductDetailClientView from "./ProductDetailClientView";
import { Loader2 } from "lucide-react";

function ProductPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || searchParams.get("id") || "";

  return <ProductDetailClientView slug={slug} />;
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-pink animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading Product...</p>
        </div>
      }
    >
      <ProductPageContent />
    </Suspense>
  );
}
