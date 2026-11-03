"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CategoryClientView from "./CategoryClientView";
import { Loader2 } from "lucide-react";

function CategoryPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || searchParams.get("category") || "";

  return <CategoryClientView slug={slug} />;
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-pink animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading Category Collection...</p>
        </div>
      }
    >
      <CategoryPageContent />
    </Suspense>
  );
}
