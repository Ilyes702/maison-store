"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn, formatPrice, getDiscountPercent } from "@/lib/utils";
import { QuantitySelector } from "./quantity-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { Check, ShoppingBag } from "lucide-react";

type ColorOpt = { id: string; name: string; hex: string };
type SizeOpt = { id: string; label: string; stock: number | null };

export function PurchasePanel({
  productId,
  slug,
  name,
  price,
  originalPrice,
  image,
  colors,
  sizes,
  stock,
  onColorChange,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  colors: ColorOpt[];
  sizes: SizeOpt[];
  stock: number | null;
  onColorChange?: (colorId: string | null) => void;
}) {
  const [colorId, setColorId] = useState<string | null>(colors[0]?.id ?? null);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const { addItem } = useCart();
  const { show } = useToast();
  const router = useRouter();

  const discount = getDiscountPercent(price, originalPrice);
  const outOfStock = (stock ?? 1) <= 0;

  const selectedColor = colors.find((c) => c.id === colorId);
  const selectedSize = sizes.find((s) => s.id === sizeId);

  function validate(): boolean {
    if (colors.length > 0 && !colorId) {
      setError("الرجاء اختيار اللون قبل المتابعة");
      return false;
    }
    if (sizes.length > 0 && !sizeId) {
      setError("الرجاء اختيار المقاس قبل المتابعة");
      return false;
    }
    setError(null);
    return true;
  }

  function handleColorChange(id: string) {
    setColorId(id);
    onColorChange?.(id);
  }

  function addToCart(): boolean {
    if (!validate()) return false;
    addItem({
      productId,
      slug,
      name,
      image,
      price,
      originalPrice,
      color: selectedColor?.name,
      size: selectedSize?.label,
      quantity,
      maxStock: stock ?? undefined,
    });
    return true;
  }

  function handleAddToCart() {
    if (!addToCart()) return;
    setAdded(true);
    show("تمت إضافة المنتج إلى السلة");
    setTimeout(() => setAdded(false), 1800);
  }

  function handleOrderNow() {
    if (!addToCart()) return;
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-ink">{formatPrice(price)}</span>
        {discount && (
          <>
            <span className="text-base text-stone line-through">
              {formatPrice(originalPrice!)}
            </span>
            <Badge kind="sale">خصم {discount}%</Badge>
          </>
        )}
      </div>

      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm text-ink-soft">
            اللون{selectedColor ? `: ${selectedColor.name}` : ""}
          </p>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleColorChange(c.id)}
                aria-label={c.name}
                aria-pressed={colorId === c.id}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-paper transition-all",
                  colorId === c.id ? "ring-ink" : "ring-transparent hover:ring-line"
                )}
              >
                <span
                  className="h-8 w-8 rounded-full border border-line/60"
                  style={{ backgroundColor: c.hex }}
                />
                {colorId === c.id && (
                  <Check
                    size={14}
                    className="absolute text-white mix-blend-difference"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm text-ink-soft">
            المقاس{selectedSize ? `: ${selectedSize.label}` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const disabled = s.stock !== null && s.stock <= 0;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSizeId(s.id)}
                  aria-pressed={sizeId === s.id}
                  className={cn(
                    "h-11 min-w-11 rounded-full border px-4 text-sm font-medium transition-colors",
                    disabled
                      ? "cursor-not-allowed border-line text-stone/50 line-through"
                      : sizeId === s.id
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink-soft hover:border-ink"
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm text-ink-soft">الكمية</p>
        <QuantitySelector value={quantity} onChange={setQuantity} max={stock ?? 99} />
      </div>

      {error && (
        <p className="rounded-lg bg-sale/10 px-3 py-2 text-sm text-sale">{error}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          <ShoppingBag size={17} />
          {added ? "أُضيف ✓" : "أضف إلى السلة"}
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={handleOrderNow}
          disabled={outOfStock}
        >
          {outOfStock ? "نفدت الكمية" : "اطلب الآن"}
        </Button>
      </div>
    </div>
  );
}
