import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceTag({
  price,
  originalPrice,
  currency = "MAD",
  size = "md",
  className,
}: {
  price: number;
  originalPrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const discount = getDiscountPercent(price, originalPrice);
  const priceSize = { sm: "text-sm", md: "text-base", lg: "text-2xl" }[size];
  const oldSize = { sm: "text-xs", md: "text-xs", lg: "text-base" }[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-bold text-ink", priceSize)}>
        {formatPrice(price, currency)}
      </span>
      {discount && (
        <span className={cn("text-stone line-through", oldSize)}>
          {formatPrice(originalPrice!, currency)}
        </span>
      )}
    </div>
  );
}
