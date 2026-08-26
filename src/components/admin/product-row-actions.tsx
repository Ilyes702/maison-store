"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/context/toast-context";

export function ProductRowActions({
  productId,
  isActive,
}: {
  productId: string;
  isActive: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(isActive);
  const router = useRouter();
  const { show } = useToast();

  async function handleToggle() {
    setLoading(true);
    const res = await fetch(`/api/admin/products/${productId}/toggle`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !active }),
    });
    setLoading(false);
    if (res.ok) {
      setActive(!active);
      show(!active ? "تم نشر المنتج" : "تم إخفاء المنتج");
    }
  }

  async function handleDelete() {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      show("تم حذف المنتج");
      router.refresh();
    } else {
      show("تعذّر حذف المنتج", "error");
    }
  }

  return (
    <div className="flex items-center gap-1">
      {loading ? (
        <Loader2 size={15} className="animate-spin text-stone" />
      ) : (
        <>
          <button
            onClick={handleToggle}
            title={active ? "إخفاء" : "نشر"}
            className="rounded-lg p-2 text-stone hover:bg-paper-dim hover:text-ink"
          >
            {active ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          <Link
            href={`/admin/products/${productId}/edit`}
            title="تعديل"
            className="rounded-lg p-2 text-stone hover:bg-paper-dim hover:text-ink"
          >
            <Pencil size={15} />
          </Link>
          <button
            onClick={handleDelete}
            title="حذف"
            className="rounded-lg p-2 text-stone hover:bg-sale/10 hover:text-sale"
          >
            <Trash2 size={15} />
          </button>
        </>
      )}
    </div>
  );
}
