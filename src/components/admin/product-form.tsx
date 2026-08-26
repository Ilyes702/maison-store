"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImageUploader, ImageEntry } from "@/components/admin/image-uploader";
import { useToast } from "@/context/toast-context";
import { getDiscountPercent } from "@/lib/utils";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };
type Color = { id: string; name: string; hex: string };
type SizeOpt = { id: string; label: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  price: string;
  originalPrice: string;
  sku: string;
  stock: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  images: ImageEntry[];
  colorIds: string[];
  sizeStocks: Record<string, string>; // sizeId -> stock string
};

export function ProductForm({
  initialValues,
  categories,
  colors,
  sizes,
}: {
  initialValues: ProductFormValues;
  categories: Category[];
  colors: Color[];
  sizes: SizeOpt[];
}) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { show } = useToast();

  const discount = getDiscountPercent(
    Number(values.price) || 0,
    values.originalPrice ? Number(values.originalPrice) : null
  );

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function toggleColor(id: string) {
    set(
      "colorIds",
      values.colorIds.includes(id)
        ? values.colorIds.filter((c) => c !== id)
        : [...values.colorIds, id]
    );
  }

  function toggleSize(id: string) {
    const next = { ...values.sizeStocks };
    if (id in next) delete next[id];
    else next[id] = "0";
    set("sizeStocks", next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim() || !values.price) {
      show("الرجاء إدخال اسم المنتج والسعر", "error");
      return;
    }
    setSaving(true);

    const payload = {
      name: values.name.trim(),
      slug: values.name.trim(),
      shortDescription: values.shortDescription,
      description: values.description,
      categoryId: values.categoryId || null,
      price: Number(values.price),
      originalPrice: values.originalPrice ? Number(values.originalPrice) : null,
      sku: values.sku,
      stock: Number(values.stock) || 0,
      isFeatured: values.isFeatured,
      isNew: values.isNew,
      isBestSeller: values.isBestSeller,
      isActive: values.isActive,
      images: values.images,
      colorIds: values.colorIds,
      sizes: Object.entries(values.sizeStocks).map(([sizeId, stock]) => ({
        sizeId,
        stock: Number(stock) || 0,
      })),
    };

    const url = values.id ? `/api/admin/products/${values.id}` : "/api/admin/products";
    const method = values.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.ok) {
      show(values.id ? "تم تحديث المنتج" : "تم إضافة المنتج");
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      show(data.error || "حدث خطأ أثناء الحفظ", "error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-2xl border border-line bg-white p-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">اسم المنتج *</label>
            <input
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
              placeholder="مثلاً: Premium Oversized Hoodie"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">وصف مختصر</label>
            <input
              value={values.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">الوصف الكامل</label>
            <textarea
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-ink">الصور</h3>
          <ImageUploader
            images={values.images}
            onChange={(imgs) => set("images", imgs)}
            colors={colors.filter((c) => values.colorIds.includes(c.id))}
          />
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-ink">الألوان المتوفرة</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleColor(c.id)}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-offset-2",
                  values.colorIds.includes(c.id) ? "ring-ink" : "ring-transparent"
                )}
              >
                <span className="h-8 w-8 rounded-full border border-line" style={{ backgroundColor: c.hex }} />
                {values.colorIds.includes(c.id) && (
                  <Check size={13} className="absolute text-white mix-blend-difference" />
                )}
              </button>
            ))}
            {colors.length === 0 && (
              <p className="text-sm text-stone">لا توجد ألوان بعد، أضفها من صفحة الألوان.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-ink">المقاسات والمخزون</h3>
          <div className="space-y-2">
            {sizes.map((s) => {
              const checked = s.id in values.sizeStocks;
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <label className="flex w-24 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSize(s.id)}
                      className="h-4 w-4 accent-accent"
                    />
                    {s.label}
                  </label>
                  {checked && (
                    <input
                      type="number"
                      min={0}
                      value={values.sizeStocks[s.id]}
                      onChange={(e) =>
                        set("sizeStocks", { ...values.sizeStocks, [s.id]: e.target.value })
                      }
                      placeholder="الكمية المتوفرة"
                      className="w-32 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-ink"
                    />
                  )}
                </div>
              );
            })}
            {sizes.length === 0 && (
              <p className="text-sm text-stone">لا توجد مقاسات بعد، أضفها من صفحة المقاسات.</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-line bg-white p-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">السعر الحالي (MAD) *</label>
            <input
              type="number"
              min={0}
              value={values.price}
              onChange={(e) => set("price", e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">السعر الأصلي (اختياري)</label>
            <input
              type="number"
              min={0}
              value={values.originalPrice}
              onChange={(e) => set("originalPrice", e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            />
            {discount !== null && (
              <p className="mt-1.5 text-xs text-accent">نسبة الخصم المحسوبة تلقائياً: {discount}%</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">SKU</label>
            <input
              value={values.sku}
              onChange={(e) => set("sku", e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">المخزون الإجمالي</label>
            <input
              type="number"
              min={0}
              value={values.stock}
              onChange={(e) => set("stock", e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">التصنيف</label>
            <select
              value={values.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            >
              <option value="">بدون تصنيف</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-line bg-white p-5">
          {[
            { key: "isFeatured" as const, label: "منتج مميز (Featured)" },
            { key: "isNew" as const, label: "جديد (New)" },
            { key: "isBestSeller" as const, label: "الأكثر مبيعاً (Best Seller)" },
            { key: "isActive" as const, label: "منشور (Active)" },
          ].map((f) => (
            <label key={f.key} className="flex items-center justify-between text-sm">
              {f.label}
              <input
                type="checkbox"
                checked={values[f.key]}
                onChange={(e) => set(f.key, e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
            </label>
          ))}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={saving}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : values.id ? "حفظ التعديلات" : "إضافة المنتج"}
        </Button>
      </div>
    </form>
  );
}
