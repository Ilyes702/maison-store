"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-status";
import { useToast } from "@/context/toast-context";
import { Loader2 } from "lucide-react";

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const { show } = useToast();
  const router = useRouter();

  async function handleChange(next: string) {
    setStatus(next);
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    if (res.ok) {
      show("تم تحديث حالة الطلب");
      router.refresh();
    } else {
      show("تعذّر تحديث الحالة", "error");
      setStatus(currentStatus);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-ink"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {loading && <Loader2 size={15} className="animate-spin text-stone" />}
    </div>
  );
}
