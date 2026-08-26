import { db } from "@/db";
import {
  products,
  productImages,
  productColors,
  productSizes,
  colors,
  sizes,
  categories,
} from "@/db/schema";
import { eq, and, desc, asc, ilike, gte, lte, sql } from "drizzle-orm";

export type ProductFilters = {
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sizeIds?: string[];
  colorIds?: string[];
  onSale?: boolean;
  isNew?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
};

async function attachRelations(productRows: (typeof products.$inferSelect)[]) {
  if (productRows.length === 0) return [];
  const ids = productRows.map((p) => p.id);

  const images = await db.query.productImages.findMany({
    where: (t, { inArray }) => inArray(t.productId, ids),
    orderBy: (t, { asc }) => asc(t.sortOrder),
  });
  const pColors = await db.query.productColors.findMany({
    where: (t, { inArray }) => inArray(t.productId, ids),
  });
  const pSizes = await db.query.productSizes.findMany({
    where: (t, { inArray }) => inArray(t.productId, ids),
  });
  const allColors = await db.query.colors.findMany();
  const allSizes = await db.query.sizes.findMany();
  const cats = await db.query.categories.findMany();

  return productRows.map((p) => ({
    ...p,
    category: cats.find((c) => c.id === p.categoryId) || null,
    images: images.filter((i) => i.productId === p.id),
    colors: pColors
      .filter((pc) => pc.productId === p.id)
      .map((pc) => allColors.find((c) => c.id === pc.colorId)!)
      .filter(Boolean),
    sizes: pSizes
      .filter((ps) => ps.productId === p.id)
      .map((ps) => ({
        ...allSizes.find((s) => s.id === ps.sizeId)!,
        stock: ps.stock,
      }))
      .filter((s) => s.id),
  }));
}

export async function getProducts(filters: ProductFilters = {}) {
  const conditions = [eq(products.isActive, true)];

  if (filters.search) {
    conditions.push(ilike(products.name, `%${filters.search}%`));
  }
  if (filters.minPrice !== undefined) {
    conditions.push(gte(products.price, filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(products.price, filters.maxPrice));
  }
  if (filters.onSale) {
    conditions.push(sql`${products.originalPrice} IS NOT NULL AND ${products.originalPrice} > ${products.price}`);
  }
  if (filters.isNew) {
    conditions.push(eq(products.isNew, true));
  }
  if (filters.categorySlug) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, filters.categorySlug),
    });
    if (cat) conditions.push(eq(products.categoryId, cat.id));
    else return [];
  }

  let orderBy;
  switch (filters.sort) {
    case "price_asc":
      orderBy = asc(products.price);
      break;
    case "price_desc":
      orderBy = desc(products.price);
      break;
    case "popular":
      orderBy = desc(products.isBestSeller);
      break;
    default:
      orderBy = desc(products.createdAt);
  }

  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(orderBy);

  let result = await attachRelations(rows);

  if (filters.colorIds?.length) {
    result = result.filter((p) =>
      p.colors.some((c) => filters.colorIds!.includes(c.id))
    );
  }
  if (filters.sizeIds?.length) {
    result = result.filter((p) =>
      p.sizes.some((s) => filters.sizeIds!.includes(s.id))
    );
  }

  return result;
}

export async function getProductBySlug(slug: string) {
  const p = await db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isActive, true)),
  });
  if (!p) return null;
  const [full] = await attachRelations([p]);
  return full;
}

export async function getFeaturedProducts() {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
    .orderBy(desc(products.createdAt));
  return attachRelations(rows);
}

export async function getNewArrivals(limit = 8) {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isNew, true)))
    .orderBy(desc(products.createdAt))
    .limit(limit);
  return attachRelations(rows);
}

export async function getAllCategories() {
  return db.query.categories.findMany({
    orderBy: (t, { asc }) => asc(t.sortOrder),
  });
}

export async function getAllColors() {
  return db.query.colors.findMany();
}

export async function getAllSizes() {
  return db.query.sizes.findMany({ orderBy: (t, { asc }) => asc(t.sortOrder) });
}

// ---- Admin CRUD ----

export async function getAllProductsAdmin() {
  const rows = await db.select().from(products).orderBy(desc(products.createdAt));
  return attachRelations(rows);
}

export async function getProductByIdAdmin(id: string) {
  const p = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!p) return null;
  const [full] = await attachRelations([p]);
  return full;
}

export async function deleteProduct(id: string) {
  await db.delete(products).where(eq(products.id, id));
}

export async function toggleProductActive(id: string, isActive: boolean) {
  await db.update(products).set({ isActive }).where(eq(products.id, id));
}
