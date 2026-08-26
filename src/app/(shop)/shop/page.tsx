import { Suspense } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ProductGrid } from "@/components/shop/product-grid";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import {
  getProducts,
  getAllCategories,
  getAllColors,
  getAllSizes,
} from "@/lib/data/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المتجر",
  description: "تصفح كل منتجاتنا من الأزياء العصرية للرجال والنساء.",
};

type SearchParams = Promise<{
  q?: string;
  category?: string;
  colors?: string;
  sizes?: string;
  sale?: string;
  new?: string;
  sort?: string;
}>;

async function ShopResults({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const products = await getProducts({
    search: sp.q,
    categorySlug: sp.category,
    colorIds: sp.colors?.split(",").filter(Boolean),
    sizeIds: sp.sizes?.split(",").filter(Boolean),
    onSale: sp.sale === "1",
    isNew: sp.new === "1",
    sort: (sp.sort as any) || "newest",
  });

  return (
    <>
      <p className="mb-6 text-sm text-stone">{products.length} منتج</p>
      <ProductGrid products={products} />
    </>
  );
}

function ShopSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [categories, colors, sizes] = await Promise.all([
    getAllCategories(),
    getAllColors(),
    getAllSizes(),
  ]);

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <h1 className="font-display text-3xl text-ink mb-1">المتجر</h1>
        <p className="mb-6 text-sm text-stone">اكتشف كل تشكيلتنا من القطع المختارة بعناية</p>

        <Suspense fallback={<div className="mb-8 h-14 w-full animate-pulse rounded-full bg-paper-dim" />}>
          <ShopFilters categories={categories} colors={colors} sizes={sizes} />
        </Suspense>

        <Suspense fallback={<ShopSkeleton />}>
          <ShopResults searchParams={searchParams} />
        </Suspense>
      </div>
    </SiteShell>
  );
}
