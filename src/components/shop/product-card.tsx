import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/ui/price-tag";
import { getDiscountPercent } from "@/lib/utils";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  isNew?: boolean | null;
  isBestSeller?: boolean | null;
  images: { url: string }[];
  stock?: number | null;
};

export function ProductCard({
  product,
  currency = "MAD",
}: {
  product: ProductCardData;
  currency?: string;
}) {
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const primary = product.images[0]?.url;
  const secondary = product.images[1]?.url;
  const outOfStock = (product.stock ?? 1) <= 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-paper-dim">
        {primary && (
          <Image
            src={primary}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-500 ${
              secondary ? "group-hover:opacity-0" : ""
            }`}
          />
        )}

        {secondary && (
          <Image
            src={secondary}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.isNew && <Badge kind="new">جديد</Badge>}
          {discount && <Badge kind="sale">خصم {discount}%</Badge>}
          {product.isBestSeller && (
            <Badge kind="best">الأكثر مبيعاً</Badge>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
            <span className="rounded-full bg-paper px-4 py-1.5 text-xs font-bold text-ink">
              نفدت الكمية
            </span>
          </div>
        )}

        <span className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-paper py-2.5 text-center text-xs font-medium text-ink opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          عرض المنتج
        </span>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-sm text-ink-soft transition-colors group-hover:text-ink line-clamp-1">
          {product.name}
        </h3>

        <PriceTag
          price={product.price}
          originalPrice={product.originalPrice}
          currency={currency}
          size="sm"
        />
      </div>
    </Link>
  );
}