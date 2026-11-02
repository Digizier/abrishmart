import React from "react";
import CategoryClientView from "./CategoryClientView";
import { INITIAL_CATEGORIES } from "@/lib/db";

// Required for Next.js static export (output: 'export')
export async function generateStaticParams() {
  return INITIAL_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryClientView slug={params.slug} />;
}
