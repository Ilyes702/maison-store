"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ImageEntry = { url: string; colorId: string | null };

export function ImageUploader({
  images,
  onChange,
  colors,
}: {
  images: ImageEntry[];
  onChange: (images: ImageEntry[]) => void;
  colors: { id: string; name: string; hex: string }[];
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: ImageEntry[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        uploaded.push({ url: data.url, colorId: null });
      }
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img, i) => (
          <div key={img.url} className="group relative aspect-square overflow-hidden rounded-xl border border-line">
            <Image src={img.url} alt="" fill sizes="150px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              className="absolute top-1.5 left-1.5 rounded-full bg-ink/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={12} />
            </button>
            {colors.length > 0 && (
              <select
                value={img.colorId || ""}
                onChange={(e) =>
                  onChange(
                    images.map((im, idx) =>
                      idx === i ? { ...im, colorId: e.target.value || null } : im
                    )
                  )
                }
                className="absolute inset-x-1 bottom-1 rounded-md bg-white/90 px-1 py-0.5 text-[10px] outline-none"
              >
                <option value="">كل الألوان</option>
                {colors.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line text-stone transition-colors hover:border-ink hover:text-ink",
          )}
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          <span className="text-[10px]">إضافة صور</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
