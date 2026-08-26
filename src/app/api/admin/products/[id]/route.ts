import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { products, productImages, productColors, productSizes } from "@/db/schema";
import { generateId } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { deleteProduct } from "@/lib/data/products";
import { z } from "zod";

const payloadSchema = z.object({
  name: z.string().min(2),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  price: z.number().min(0),
  originalPrice: z.number().min(0).optional().nullable(),
  sku: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isActive: z.boolean().optional(),
  images: z.array(z.object({ url: z.string(), colorId: z.string().optional().nullable() })),
  colorIds: z.array(z.string()),
  sizes: z.array(z.object({ sizeId: z.string(), stock: z.number().int().min(0) })),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" }, { status: 400 });
  }
  const data = parsed.data;

  await db
    .update(products)
    .set({
      name: data.name,
      shortDescription: data.shortDescription || "",
      description: data.description || "",
      categoryId: data.categoryId || null,
      price: data.price,
      originalPrice: data.originalPrice || null,
      sku: data.sku || "",
      stock: data.stock,
      isFeatured: !!data.isFeatured,
      isNew: !!data.isNew,
      isBestSeller: !!data.isBestSeller,
      isActive: data.isActive !== false,
    })
    .where(eq(products.id, id));

  // Replace relations wholesale for simplicity
  await db.delete(productImages).where(eq(productImages.productId, id));
  await db.delete(productColors).where(eq(productColors.productId, id));
  await db.delete(productSizes).where(eq(productSizes.productId, id));

  for (let i = 0; i < data.images.length; i++) {
    await db.insert(productImages).values({
      id: generateId("img_"),
      productId: id,
      url: data.images[i].url,
      colorId: data.images[i].colorId || null,
      sortOrder: i,
    });
  }
  for (const colorId of data.colorIds) {
    await db.insert(productColors).values({ id: generateId("pc_"), productId: id, colorId });
  }
  for (const s of data.sizes) {
    await db.insert(productSizes).values({
      id: generateId("ps_"),
      productId: id,
      sizeId: s.sizeId,
      stock: s.stock,
    });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
