import { AdminHeader } from "@/components/admin/admin-header";
import { ProductForm, ProductFormValues } from "@/components/admin/product-form";
import {
  getAllCategories,
  getAllColors,
  getAllSizes,
  getProductByIdAdmin,
} from "@/lib/data/products";
import { notFound } from "next/navigation";

export const metadata = { title: "تعديل المنتج" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, colors, sizes] = await Promise.all([
    getProductByIdAdmin(id),
    getAllCategories(),
    getAllColors(),
    getAllSizes(),
  ]);

  if (!product) notFound();

  const initialValues: ProductFormValues = {
    id: product.id,
    name: product.name,
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    categoryId: product.categoryId || "",
    price: String(product.price),
    originalPrice: product.originalPrice ? String(product.originalPrice) : "",
    sku: product.sku || "",
    stock: String(product.stock ?? 0),
    isFeatured: !!product.isFeatured,
    isNew: !!product.isNew,
    isBestSeller: !!product.isBestSeller,
    isActive: !!product.isActive,
    images: product.images.map((i) => ({ url: i.url, colorId: i.colorId })),
    colorIds: product.colors.map((c) => c.id),
    sizeStocks: Object.fromEntries(product.sizes.map((s) => [s.id, String(s.stock ?? 0)])),
  };

  return (
    <div>
      <AdminHeader title={`تعديل: ${product.name}`} />
      <div className="p-6 md:p-8">
        <ProductForm initialValues={initialValues} categories={categories} colors={colors} sizes={sizes} />
      </div>
    </div>
  );
}
