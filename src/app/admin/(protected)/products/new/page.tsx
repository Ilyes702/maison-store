import { AdminHeader } from "@/components/admin/admin-header";
import { ProductForm, ProductFormValues } from "@/components/admin/product-form";
import { getAllCategories, getAllColors, getAllSizes } from "@/lib/data/products";

export const metadata = { title: "إضافة منتج" };

const emptyValues: ProductFormValues = {
  name: "",
  shortDescription: "",
  description: "",
  categoryId: "",
  price: "",
  originalPrice: "",
  sku: "",
  stock: "0",
  isFeatured: false,
  isNew: true,
  isBestSeller: false,
  isActive: true,
  images: [],
  colorIds: [],
  sizeStocks: {},
};

export default async function NewProductPage() {
  const [categories, colors, sizes] = await Promise.all([
    getAllCategories(),
    getAllColors(),
    getAllSizes(),
  ]);

  return (
    <div>
      <AdminHeader title="إضافة منتج جديد" description="أضف تفاصيل المنتج والصور والمقاسات" />
      <div className="p-6 md:p-8">
        <ProductForm initialValues={emptyValues} categories={categories} colors={colors} sizes={sizes} />
      </div>
    </div>
  );
}
