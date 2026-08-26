import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { toggleProductActive } from "@/lib/data/products";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const { isActive } = await req.json();
  await toggleProductActive(id, !!isActive);
  return NextResponse.json({ ok: true });
}
