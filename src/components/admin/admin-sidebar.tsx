"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Home,
  LogOut,
  Palette,
  Ruler,
  Tags,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/categories", label: "التصنيفات", icon: Tags },
  { href: "/admin/colors", label: "الألوان", icon: Palette },
  { href: "/admin/sizes", label: "المقاسات", icon: Ruler },
  { href: "/admin/homepage", label: "الصفحة الرئيسية", icon: Home },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminSidebar({ pendingOrders }: { pendingOrders: number }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-l border-line bg-paper md:flex">
      <div className="px-6 py-6">
        <span className="font-display text-xl text-ink">لوحة التحكم</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-dim"
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon size={17} />
                {item.label}
              </span>
              {item.href === "/admin/orders" && pendingOrders > 0 && (
                <span className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                  active ? "bg-paper text-ink" : "bg-sale text-white"
                )}>
                  {pendingOrders}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-line p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft hover:bg-paper-dim"
        >
          <LogOut size={17} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
