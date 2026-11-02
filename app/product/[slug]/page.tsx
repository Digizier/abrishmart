import React from "react";
import ProductDetailClientView from "./ProductDetailClientView";
import { INITIAL_PRODUCTS } from "@/lib/db";

// Required for Next.js static export (output: 'export')
export async function generateStaticParams() {
  return INITIAL_PRODUCTS.map((prod) => ({
    slug: prod.slug,
  }));
}

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailClientView slug={params.slug} />;
}
