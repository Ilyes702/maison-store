"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  productName,
  activeColorId,
}: {
  images: { url: string; colorId?: string | null }[];
  productName: string;
  activeColorId?: string | null;
}) {
  const filtered = activeColorId
    ? images.filter((i) => !i.colorId || i.colorId === activeColorId)
    : images;
  const list = filtered.length > 0 ? filtered : images;

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const safeActive = Math.min(active, Math.max(0, list.length - 1));
  const current = list[safeActive];

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {list.length > 1 && (
        <div className="thin-scroll flex gap-2 overflow-x-auto md:w-20 md:flex-col md:overflow-y-auto">
          {list.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors md:h-20 md:w-20",
                safeActive === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
              )}
              aria-label={`صورة ${i + 1}`}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1">
        <button
          className="relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-paper-dim"
          onClick={() => setLightbox(true)}
          aria-label="تكبير الصورة"
        >
          {current && (
            <Image
              src={current.url}
              alt={productName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          )}
          <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink shadow">
            <ZoomIn size={16} />
          </span>
        </button>
      </div>

      {lightbox && current && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 animate-fade-up"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-5 left-5 text-paper"
            aria-label="إغلاق"
            onClick={() => setLightbox(false)}
          >
            <X size={26} />
          </button>
          <div className="relative h-[85vh] w-full max-w-3xl">
            <Image src={current.url} alt={productName} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
