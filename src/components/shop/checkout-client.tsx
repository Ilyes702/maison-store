"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice, isValidMoroccanPhone } from "@/lib/utils";
import { MOROCCAN_CITIES } from "@/lib/cities";
import { ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";

type FormState = {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
};

const initialState: FormState = {
  customerName: "",
  phone: "",
  city: "",
  address: "",
  notes: "",
};

export function CheckoutClient({ deliveryInfo }: { deliveryInfo: string }) {
  const { lines, subtotal, clearCart, isHydrated } = useCart();
  const { show } = useToast();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.customerName.trim().length < 2) next.customerName = "الرجاء إدخال الاسم الكامل";
    if (!isValidMoroccanPhone(form.phone)) next.phone = "رقم الهاتف غير صحيح (مثال: 06XXXXXXXX)";
    if (!form.city) next.city = "الرجاء اختيار المدينة";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: lines.map((l) => ({
            productId: l.productId,
            productName: l.name,
            productImage: l.image,
            color: l.color,
            size: l.size,
            quantity: l.quantity,
            price: l.price,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        show(data.error || "حدث خطأ أثناء إرسال الطلب. المرجو المحاولة مرة أخرى.", "error");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(
        `/order-confirmation?order=${data.orderNumber}&total=${data.total}`
      );
    } catch {
      show("حدث خطأ أثناء إرسال الطلب. المرجو المحاولة مرة أخرى.", "error");
      setSubmitting(false);
    }
  }

  if (!isHydrated) {
    return <div className="skeleton h-96 w-full rounded-2xl" />;
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="سلتك فارغة"
        description="أضف منتجات إلى السلة أولاً لإتمام الطلب."
        icon={ShoppingBag}
        action={<Link href="/shop" className="mt-2 text-sm text-accent hover:underline">تصفح المنتجات ←</Link>}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-2" noValidate>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">الاسم الكامل *</label>
          <input
            value={form.customerName}
            onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
            placeholder="مثلاً: أحمد العلوي"
          />
          {errors.customerName && <p className="mt-1 text-xs text-sale">{errors.customerName}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">رقم الهاتف *</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            dir="ltr"
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink text-right"
            placeholder="06XXXXXXXX"
          />
          {errors.phone && <p className="mt-1 text-xs text-sale">{errors.phone}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">المدينة *</label>
          <select
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
          >
            <option value="">اختر المدينة</option>
            {MOROCCAN_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.city && <p className="mt-1 text-xs text-sale">{errors.city}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-ink-soft">العنوان / ملاحظات إضافية</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            rows={3}
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
            placeholder="الحي، الشارع، رقم المنزل..."
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> جارٍ الإرسال...
            </>
          ) : (
            "تأكيد الطلب"
          )}
        </Button>
      </form>

      <div className="h-fit space-y-4 rounded-2xl border border-line p-6">
        <h2 className="font-display text-lg text-ink">ملخص الطلب</h2>
        <div className="space-y-3 border-b border-line pb-4">
          {lines.map((l) => (
            <div key={l.key} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-paper-dim">
                {l.image && <Image src={l.image} alt={l.name} fill sizes="56px" className="object-cover" />}
              </div>
              <div className="flex-1 text-xs">
                <p className="text-ink">{l.name}</p>
                <p className="mt-0.5 text-stone">
                  {[l.color, l.size, `x${l.quantity}`].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span className="text-xs font-bold text-ink">{formatPrice(l.price * l.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-base font-bold text-ink">
          <span>الإجمالي</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className="rounded-xl bg-accent-soft px-3 py-2 text-xs text-accent">{deliveryInfo}</p>
      </div>
    </div>
  );
}
