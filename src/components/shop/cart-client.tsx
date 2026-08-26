"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { QuantitySelector } from "@/components/shop/quantity-selector";
import { Button, LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice } from "@/lib/utils";
import { Trash2, ShoppingBag } from "lucide-react";

export function CartClient() {
  const { lines, updateQuantity, removeItem, subtotal, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="skeleton h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="سلتك فارغة"
        description="لم تقم بإضافة أي منتج بعد، ابدأ التسوق الآن."
        icon={ShoppingBag}
        action={
          <LinkButton href="/shop" className="mt-2">
            تصفح المنتجات
          </LinkButton>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {lines.map((line) => (
          <div
            key={line.key}
            className="flex gap-4 rounded-2xl border border-line p-4 animate-fade-up"
          >
            <Link href={`/product/${line.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-paper-dim">
              {line.image && (
                <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover" />
              )}
            </Link>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link href={`/product/${line.slug}`} className="text-sm font-medium text-ink hover:underline">
                    {line.name}
                  </Link>
                  <p className="mt-1 text-xs text-stone">
                    {[line.color, line.size].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(line.key)}
                  aria-label="إزالة"
                  className="p-1 text-stone hover:text-sale"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <QuantitySelector
                  value={line.quantity}
                  onChange={(v) => updateQuantity(line.key, v)}
                  max={line.maxStock ?? 99}
                />
                <span className="font-bold text-ink">
                  {formatPrice(line.price * line.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-2xl border border-line p-6">
        <h2 className="font-display text-lg text-ink mb-4">ملخص الطلب</h2>
        <div className="flex justify-between text-sm text-ink-soft">
          <span>المجموع الفرعي</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-stone">
          <span>التوصيل</span>
          <span>يُحدد عند التأكيد</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-bold text-ink">
          <span>الإجمالي</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <LinkButton href="/checkout" className="mt-6 w-full">
          إتمام الطلب
        </LinkButton>
      </div>
    </div>
  );
}
