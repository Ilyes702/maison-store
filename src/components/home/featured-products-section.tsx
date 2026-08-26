import Link from "next/link";
import { ProductGrid } from "@/components/shop/product-grid";
import { ProductCardData } from "@/components/shop/product-card";

export function FeaturedProductsSection({
  title,
  products,
  viewAllHref = "/shop",
}: {
  title: string;
  products: ProductCardData[];
  viewAllHref?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-3xl text-ink">{title}</h2>
        <Link href={viewAllHref} className="text-sm text-accent hover:underline">
          عرض الكل ←
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
