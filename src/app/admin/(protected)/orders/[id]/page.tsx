import { AdminHeader } from "@/components/admin/admin-header";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { getOrderById } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";

export const metadata = { title: "تفاصيل الطلب" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div>
      <AdminHeader
        title={`طلب ${order.orderNumber}`}
        description={order.createdAt?.slice(0, 16).replace("T", " ")}
        action={<OrderStatusSelect orderId={order.id} currentStatus={order.status} />}
      />

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3 md:p-8">
        <div className="space-y-4 md:col-span-2">
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-3 font-display text-lg text-ink">المنتجات</h2>
            <div className="divide-y divide-line">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-paper-dim">
                    {item.productImage && (
                      <Image src={item.productImage} alt={item.productName} fill sizes="56px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="text-ink">{item.productName}</p>
                    <p className="mt-0.5 text-xs text-stone">
                      {[item.color, item.size, `الكمية: ${item.quantity}`].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="font-bold text-ink">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-bold text-ink">
              <span>الإجمالي</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {order.notes && (
            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="mb-2 font-display text-base text-ink">ملاحظات</h2>
              <p className="text-sm text-ink-soft">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-3 font-display text-lg text-ink">معلومات العميل</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-stone">الاسم الكامل</dt>
              <dd className="mt-0.5 text-ink">{order.customerName}</dd>
            </div>
            <div>
              <dt className="text-xs text-stone">رقم الهاتف</dt>
              <dd className="mt-0.5 text-ink" dir="ltr">{order.phone}</dd>
            </div>
            <div>
              <dt className="text-xs text-stone">المدينة</dt>
              <dd className="mt-0.5 text-ink">{order.city}</dd>
            </div>
            {order.address && (
              <div>
                <dt className="text-xs text-stone">العنوان</dt>
                <dd className="mt-0.5 text-ink">{order.address}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
