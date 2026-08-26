import { AdminHeader } from "@/components/admin/admin-header";
import { getAllOrdersAdmin } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/order-status";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = { title: "الطلبات" };

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersAdmin();

  return (
    <div>
      <AdminHeader title="الطلبات" description={`${orders.length} طلب إجمالاً`} />

      <div className="p-6 md:p-8">
        {orders.length === 0 ? (
          <EmptyState title="لا توجد طلبات جديدة" icon={ShoppingCart} />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-line text-right text-xs text-stone">
                  <th className="p-4 font-medium">رقم الطلب</th>
                  <th className="p-4 font-medium">العميل</th>
                  <th className="p-4 font-medium">الهاتف</th>
                  <th className="p-4 font-medium">المدينة</th>
                  <th className="p-4 font-medium">الإجمالي</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-paper-dim/40">
                    <td className="p-4">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-accent hover:underline" dir="ltr">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="p-4">{o.customerName}</td>
                    <td className="p-4" dir="ltr">{o.phone}</td>
                    <td className="p-4">{o.city}</td>
                    <td className="p-4 font-bold">{formatPrice(o.total)}</td>
                    <td className="p-4">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", ORDER_STATUS_COLORS[o.status])}>
                        {ORDER_STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-stone">{o.createdAt?.slice(0, 16).replace("T", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
