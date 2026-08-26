import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/data/orders";
import { isValidMoroccanPhone } from "@/lib/utils";

const itemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  productImage: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
});

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "الاسم الكامل مطلوب"),
  phone: z
    .string()
    .trim()
    .refine(isValidMoroccanPhone, "رقم الهاتف غير صحيح"),
  city: z.string().trim().min(1, "المدينة مطلوبة"),
  address: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, "السلة فارغة"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "بيانات غير صحيحة";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const result = await createOrder(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("[orders.create]", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إرسال الطلب. المرجو المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}
