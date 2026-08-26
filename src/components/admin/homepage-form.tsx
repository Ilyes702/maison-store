"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useToast } from "@/context/toast-context";
import { Loader2 } from "lucide-react";

type Content = {
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroImage: string | null;
  heroCta: string | null;
  promoTitle: string | null;
  promoSubtitle: string | null;
  promoImage: string | null;
};

export function HomepageForm({ initial }: { initial: Content }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { show } = useToast();

  function set<K extends keyof Content>(key: K, value: Content[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/homepage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) {
      show("تم حفظ محتوى الصفحة الرئيسية");
      router.refresh();
    } else {
      show("تعذّر الحفظ", "error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h3 className="font-display text-lg text-ink">القسم الرئيسي (Hero)</h3>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">العنوان الرئيسي</label>
          <input
            value={values.heroTitle || ""}
            onChange={(e) => set("heroTitle", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">العنوان الفرعي</label>
          <textarea
            value={values.heroSubtitle || ""}
            onChange={(e) => set("heroSubtitle", e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">نص الزر (CTA)</label>
          <input
            value={values.heroCta || ""}
            onChange={(e) => set("heroCta", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">صورة الغلاف</label>
          <ImageUploader
            images={values.heroImage ? [{ url: values.heroImage, colorId: null }] : []}
            onChange={(imgs) => set("heroImage", imgs[0]?.url || null)}
            colors={[]}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h3 className="font-display text-lg text-ink">بانر العروض</h3>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">عنوان البانر</label>
          <input
            value={values.promoTitle || ""}
            onChange={(e) => set("promoTitle", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">وصف البانر</label>
          <input
            value={values.promoSubtitle || ""}
            onChange={(e) => set("promoSubtitle", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">صورة البانر</label>
          <ImageUploader
            images={values.promoImage ? [{ url: values.promoImage, colorId: null }] : []}
            onChange={(imgs) => set("promoImage", imgs[0]?.url || null)}
            colors={[]}
          />
        </div>
      </div>

      <div className="lg:col-span-2">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : "حفظ"}
        </Button>
      </div>
    </form>
  );
}
