import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/data/orders";
import { ORDER_STATUSES } from "@/lib/order-status";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  if (!ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "حالة غير صحيحة" }, { status: 400 });
  }

  await updateOrderStatus(id, status);
  return NextResponse.json({ ok: true });
}
