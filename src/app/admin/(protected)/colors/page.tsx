import { AdminHeader } from "@/components/admin/admin-header";
import { ColorsManager } from "@/components/admin/colors-manager";
import { getAllColors } from "@/lib/data/products";

export const metadata = { title: "الألوان" };

export default async function AdminColorsPage() {
  const colors = await getAllColors();
  return (
    <div>
      <AdminHeader title="الألوان" description="أدر مجموعة الألوان المتاحة للمنتجات" />
      <div className="p-6 md:p-8">
        <ColorsManager initial={colors} />
      </div>
    </div>
  );
}
