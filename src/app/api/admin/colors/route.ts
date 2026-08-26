import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { colors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { name, hex } = await req.json();
  if (!name?.trim() || !hex) {
    return NextResponse.json({ error: "الاسم واللون مطلوبان" }, { status: 400 });
  }

  const id = generateId("col_");
  await db.insert(colors).values({ id, name: name.trim(), hex });
  return NextResponse.json({ ok: true, id }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(colors).where(eq(colors.id, id));
  return NextResponse.json({ ok: true });
}
