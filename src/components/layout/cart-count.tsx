"use client";

import { useCart } from "@/context/cart-context";

export function CartCount() {
  const { totalItems, isHydrated } = useCart();
  if (!isHydrated || totalItems === 0) return null;
  return (
    <span className="absolute -top-2 -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-paper">
      {totalItems > 9 ? "9+" : totalItems}
    </span>
  );
}
