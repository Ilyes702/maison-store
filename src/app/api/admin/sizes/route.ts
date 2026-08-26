import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { sizes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { label } = await req.json();
  if (!label?.trim()) return NextResponse.json({ error: "المقاس مطلوب" }, { status: 400 });

  const id = generateId("sz_");
  const count = (await db.select().from(sizes)).length;
  await db.insert(sizes).values({ id, label: label.trim(), sortOrder: count });
  return NextResponse.json({ ok: true, id }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(sizes).where(eq(sizes.id, id));
  return NextResponse.json({ ok: true });
}
