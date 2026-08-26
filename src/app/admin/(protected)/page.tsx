import { AdminHeader } from "@/components/admin/admin-header";
import { StatCard } from "@/components/admin/stat-card";
import { getOrdersStats, getAllOrdersAdmin } from "@/lib/data/orders";
import { getAllProductsAdmin } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Wallet,
  XCircle,
} from "lucide-react";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";

export const metadata = { title: "نظرة عامة" };

export default async function AdminDashboardPage() {
  const [stats, products, orders] = await Promise.all([
    getOrdersStats(),
    getAllProductsAdmin(),
    getAllOrdersAdmin(),
  ]);

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <AdminHeader title="نظرة عامة" description="ملخص أداء متجرك" />

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard label="إجمالي المنتجات" value={products.length} icon={Package} />
          <StatCard label="إجمالي الطلبات" value={stats.total} icon={ShoppingCart} tone="accent" />
          <StatCard label="طلبات جديدة" value={stats.pending} icon={Clock} tone="warning" />
          <StatCard label="طلبات مؤكدة" value={stats.confirmed} icon={CheckCircle2} tone="accent" />
          <StatCard label="طلبات ملغاة" value={stats.cancelled} icon={XCircle} tone="danger" />
          <StatCard label="إجمالي الإيرادات" value={formatPrice(stats.revenue)} icon={Wallet} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="طلبات اليوم" value={stats.today} icon={Clock} />
          <StatCard label="طلبات هذا الأسبوع" value={stats.thisWeek} icon={Clock} />
          <StatCard label="طلبات هذا الشهر" value={stats.thisMonth} icon={Clock} />
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line p-5">
            <h2 className="font-display text-lg text-ink">أحدث الطلبات</h2>
            <Link href="/admin/orders" className="text-sm text-accent hover:underline">
              عرض الكل ←
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="p-8 text-center text-sm text-stone">لا توجد طلبات جديدة.</p>
          ) : (
            <div className="divide-y divide-line">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between p-4 text-sm hover:bg-paper-dim/50 md:px-6"
                >
                  <div>
                    <p className="font-medium text-ink">{o.customerName}</p>
                    <p className="mt-0.5 text-xs text-stone" dir="ltr">{o.orderNumber}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-ink">{formatPrice(o.total)}</p>
                    <p className="mt-0.5 text-xs text-stone">{ORDER_STATUS_LABELS[o.status] || o.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
