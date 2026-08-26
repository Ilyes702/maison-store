import { AdminHeader } from "@/components/admin/admin-header";
import { SizesManager } from "@/components/admin/sizes-manager";
import { getAllSizes } from "@/lib/data/products";

export const metadata = { title: "المقاسات" };

export default async function AdminSizesPage() {
  const sizes = await getAllSizes();
  return (
    <div>
      <AdminHeader title="المقاسات" description="أدر قائمة المقاسات المتاحة للمنتجات" />
      <div className="p-6 md:p-8">
        <SizesManager initial={sizes} />
      </div>
    </div>
  );
}
