import { ProductCard, ProductCardData } from "./product-card";
import { EmptyState } from "@/components/ui/empty-state";

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="لا توجد منتجات حالياً"
        description="لم نجد أي منتج مطابق لبحثك، جرّب تعديل الفلاتر."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <div key={p.slug} className="animate-fade-up" style={{ animationDelay: `${(i % 8) * 60}ms` }}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
