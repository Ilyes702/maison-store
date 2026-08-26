import { AdminHeader } from "@/components/admin/admin-header";
import { LinkButton } from "@/components/ui/button";
import { getAllProductsAdmin } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { Package, Plus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const metadata = { title: "المنتجات" };

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div>
      <AdminHeader
        title="المنتجات"
        description={`${products.length} منتج`}
        action={
          <LinkButton href="/admin/products/new" size="sm">
            <Plus size={15} /> إضافة منتج
          </LinkButton>
        }
      />

      <div className="p-6 md:p-8">
        {products.length === 0 ? (
          <EmptyState
            title="لا توجد منتجات بعد"
            description="ابدأ بإضافة أول منتج في متجرك."
            icon={Package}
            action={
              <LinkButton href="/admin/products/new" className="mt-2">
                إضافة منتج
              </LinkButton>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-line text-right text-xs text-stone">
                  <th className="p-4 font-medium">المنتج</th>
                  <th className="p-4 font-medium">السعر</th>
                  <th className="p-4 font-medium">المخزون</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-paper-dim/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-paper-dim">
                          {p.images[0] && (
                            <Image src={p.images[0].url} alt={p.name} fill sizes="40px" className="object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-ink">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4">{formatPrice(p.price)}</td>
                    <td className="p-4">
                      <span className={cn(p.stock !== null && p.stock <= 0 && "text-sale")}>
                        {p.stock ?? 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        p.isActive ? "bg-accent-soft text-accent" : "bg-paper-dim text-stone"
                      )}>
                        {p.isActive ? "منشور" : "مخفي"}
                      </span>
                    </td>
                    <td className="p-4">
                      <ProductRowActions productId={p.id} isActive={!!p.isActive} />
                    </td>
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
