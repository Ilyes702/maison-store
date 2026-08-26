import { AdminHeader } from "@/components/admin/admin-header";
import { CategoriesManager } from "@/components/admin/categories-manager";
import { getAllCategories } from "@/lib/data/products";

export const metadata = { title: "التصنيفات" };

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();
  return (
    <div>
      <AdminHeader title="التصنيفات" description="أضف وحرّر تصنيفات المنتجات" />
      <div className="p-6 md:p-8">
        <CategoriesManager initial={categories} />
      </div>
    </div>
  );
}
