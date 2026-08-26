"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useToast } from "@/context/toast-context";
import { Loader2 } from "lucide-react";

type Settings = {
  storeName: string;
  logo: string | null;
  currency: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  address: string | null;
  deliveryInfo: string | null;
  codEnabled: boolean | null;
};

export function SettingsForm({ initial }: { initial: Settings }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { show } = useToast();

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) {
      show("تم حفظ الإعدادات");
      router.refresh();
    } else {
      show("تعذّر الحفظ", "error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h3 className="font-display text-lg text-ink">معلومات المتجر</h3>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">اسم المتجر</label>
          <input
            value={values.storeName}
            onChange={(e) => set("storeName", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">الشعار (Logo)</label>
          <ImageUploader
            images={values.logo ? [{ url: values.logo, colorId: null }] : []}
            onChange={(imgs) => set("logo", imgs[0]?.url || null)}
            colors={[]}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">العملة</label>
          <input
            value={values.currency}
            onChange={(e) => set("currency", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            dir="ltr"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h3 className="font-display text-lg text-ink">التواصل</h3>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">الهاتف</label>
          <input
            value={values.phone || ""}
            onChange={(e) => set("phone", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            dir="ltr"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">واتساب</label>
          <input
            value={values.whatsapp || ""}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="212600000000"
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            dir="ltr"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">البريد الإلكتروني</label>
          <input
            value={values.email || ""}
            onChange={(e) => set("email", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            dir="ltr"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">إنستغرام (رابط كامل)</label>
          <input
            value={values.instagram || ""}
            onChange={(e) => set("instagram", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            dir="ltr"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">فيسبوك (رابط كامل)</label>
          <input
            value={values.facebook || ""}
            onChange={(e) => set("facebook", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            dir="ltr"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">العنوان</label>
          <input
            value={values.address || ""}
            onChange={(e) => set("address", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-line bg-white p-5 lg:col-span-2">
        <h3 className="font-display text-lg text-ink">الطلبات والتوصيل</h3>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">نص معلومات التوصيل</label>
          <input
            value={values.deliveryInfo || ""}
            onChange={(e) => set("deliveryInfo", e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <label className="flex w-fit items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={!!values.codEnabled}
            onChange={(e) => set("codEnabled", e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          تفعيل الدفع عند الاستلام
        </label>
      </div>

      <div className="lg:col-span-2">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : "حفظ الإعدادات"}
        </Button>
      </div>
    </form>
  );
}
