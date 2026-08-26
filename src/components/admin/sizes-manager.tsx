"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toast-context";
import { Trash2, Loader2 } from "lucide-react";

type Size = { id: string; label: string };

export function SizesManager({ initial }: { initial: Size[] }) {
  const [items, setItems] = useState(initial);
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { show } = useToast();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/sizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    });
    setSaving(false);
    if (res.ok) {
      show("تمت إضافة المقاس");
      setLabel("");
      router.refresh();
    } else {
      show("تعذّرت الإضافة", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا المقاس؟")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch("/api/admin/sizes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <form onSubmit={handleAdd} className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h3 className="font-display text-lg text-ink">إضافة مقاس</h3>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">المقاس</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            placeholder="مثلاً: XL"
          />
        </div>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : "إضافة"}
        </Button>
      </form>

      <div className="space-y-3 lg:col-span-2">
        <div className="flex flex-wrap gap-3">
          {items.map((s) => (
            <div key={s.id} className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2">
              <span className="text-sm font-medium text-ink">{s.label}</span>
              <button onClick={() => handleDelete(s.id)} className="text-stone hover:text-sale">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        {items.length === 0 && <p className="text-sm text-stone">لا توجد مقاسات بعد.</p>}
      </div>
    </div>
  );
}
