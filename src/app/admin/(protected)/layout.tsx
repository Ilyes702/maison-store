import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { getOrdersStats } from "@/lib/data/orders";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stats = await getOrdersStats();

  return (
    <div className="flex min-h-screen bg-paper-dim/40" dir="rtl">
      <AdminSidebar pendingOrders={stats.pending} />
      <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">{children}</main>
      <AdminMobileNav />
    </div>
  );
}
