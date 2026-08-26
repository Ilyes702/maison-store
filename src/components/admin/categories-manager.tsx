"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useToast } from "@/context/toast-context";
import { Trash2, Loader2 } from "lucide-react";

type Category = { id: string; name: string; slug: string; image: string | null };

export function CategoriesManager({ initial }: { initial: Category[] }) {
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { show } = useToast();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image }),
    });
    setSaving(false);
    if (res.ok) {
      show("تمت إضافة التصنيف");
      setName("");
      setImage(null);
      router.refresh();
    } else {
      show("تعذّرت الإضافة", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا التصنيف؟")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <form onSubmit={handleAdd} className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h3 className="font-display text-lg text-ink">إضافة تصنيف</h3>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">الاسم</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            placeholder="مثلاً: نساء"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">صورة (اختياري)</label>
          <ImageUploader
            images={image ? [{ url: image, colorId: null }] : []}
            onChange={(imgs) => setImage(imgs[0]?.url || null)}
            colors={[]}
          />
        </div>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : "إضافة"}
        </Button>
      </form>

      <div className="space-y-3 lg:col-span-2">
        {items.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-paper-dim">
                {cat.image && <Image src={cat.image} alt={cat.name} fill sizes="48px" className="object-cover" />}
              </div>
              <span className="text-sm font-medium text-ink">{cat.name}</span>
            </div>
            <button onClick={() => handleDelete(cat.id)} className="rounded-lg p-2 text-stone hover:bg-sale/10 hover:text-sale">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-stone">لا توجد تصنيفات بعد.</p>}
      </div>
    </div>
  );
}
