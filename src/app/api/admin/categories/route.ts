import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId, slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { name, image } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });

  const id = generateId("cat_");
  await db.insert(categories).values({
    id,
    name: name.trim(),
    slug: slugify(name) + "-" + id.slice(-4),
    image: image || null,
    sortOrder: 0,
  });

  return NextResponse.json({ ok: true, id }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(categories).where(eq(categories.id, id));
  return NextResponse.json({ ok: true });
}
