"use client";

import { useState } from "react";
import { ProductGallery } from "./product-gallery";
import { PurchasePanel } from "./purchase-panel";

export function ProductDetailInteractive({
  productId,
  slug,
  name,
  price,
  originalPrice,
  images,
  colors,
  sizes,
  stock,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  images: { url: string; colorId?: string | null }[];
  colors: { id: string; name: string; hex: string }[];
  sizes: { id: string; label: string; stock: number | null }[];
  stock: number | null;
}) {
  const [activeColorId, setActiveColorId] = useState<string | null>(
    colors[0]?.id ?? null
  );

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
      <ProductGallery images={images} productName={name} activeColorId={activeColorId} />
      <PurchasePanel
        productId={productId}
        slug={slug}
        name={name}
        price={price}
        originalPrice={originalPrice}
        image={images[0]?.url || ""}
        colors={colors}
        sizes={sizes}
        stock={stock}
        onColorChange={setActiveColorId}
      />
    </div>
  );
}
