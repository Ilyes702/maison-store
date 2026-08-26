"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toast-context";
import { Trash2, Loader2 } from "lucide-react";

type Color = { id: string; name: string; hex: string };

export function ColorsManager({ initial }: { initial: Color[] }) {
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#000000");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { show } = useToast();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/colors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, hex }),
    });
    setSaving(false);
    if (res.ok) {
      show("تمت إضافة اللون");
      setName("");
      router.refresh();
    } else {
      show("تعذّرت الإضافة", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا اللون؟")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch("/api/admin/colors", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <form onSubmit={handleAdd} className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h3 className="font-display text-lg text-ink">إضافة لون</h3>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">الاسم</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            placeholder="مثلاً: أسود"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">اللون</label>
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="h-11 w-full rounded-xl border border-line"
          />
        </div>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : "إضافة"}
        </Button>
      </form>

      <div className="space-y-3 lg:col-span-2">
        {items.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full border border-line" style={{ backgroundColor: c.hex }} />
              <span className="text-sm font-medium text-ink">{c.name}</span>
            </div>
            <button onClick={() => handleDelete(c.id)} className="rounded-lg p-2 text-stone hover:bg-sale/10 hover:text-sale">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-stone">لا توجد ألوان بعد.</p>}
      </div>
    </div>
  );
}
