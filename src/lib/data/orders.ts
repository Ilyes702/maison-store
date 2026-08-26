import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { generateId, generateOrderNumber } from "@/lib/utils";

export type CartItemInput = {
  productId: string;
  productName: string;
  productImage?: string;
  color?: string;
  size?: string;
  quantity: number;
  price: number;
};

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  city: string;
  address?: string;
  notes?: string;
  items: CartItemInput[];
};

export async function createOrder(input: CreateOrderInput) {
  const total = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const orderId = generateId("ord_");
  const orderNumber = generateOrderNumber();

  await db.insert(orders).values({
    id: orderId,
    orderNumber,
    customerName: input.customerName,
    phone: input.phone,
    city: input.city,
    address: input.address || "",
    notes: input.notes || "",
    total,
    status: "new",
  });

  for (const item of input.items) {
    await db.insert(orderItems).values({
      id: generateId("item_"),
      orderId,
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage || "",
      color: item.color || "",
      size: item.size || "",
      quantity: item.quantity,
      price: item.price,
    });

    // decrement stock (best-effort, ignore if it goes negative)
    await db
      .update(products)
      .set({ stock: sql`${products.stock} - ${item.quantity}` })
      .where(eq(products.id, item.productId));
  }

  return { orderId, orderNumber, total };
}

export async function getAllOrdersAdmin() {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const items = await db.select().from(orderItems);
  return rows.map((o) => ({
    ...o,
    items: items.filter((i) => i.orderId === o.id),
  }));
}

export async function getOrderById(id: string) {
  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));
  return { ...order, items };
}

export async function updateOrderStatus(id: string, status: string) {
  await db.update(orders).set({ status }).where(eq(orders.id, id));
}

export async function getOrdersStats() {
  const all = await db.select().from(orders);
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const parseDate = (d: string | null) => (d ? new Date(d.replace(" ", "T") + "Z") : new Date());

  return {
    total: all.length,
    pending: all.filter((o) => o.status === "new").length,
    confirmed: all.filter((o) => o.status === "confirmed").length,
    cancelled: all.filter((o) => o.status === "cancelled").length,
    revenue: all
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0),
    today: all.filter((o) => parseDate(o.createdAt) >= startOfDay).length,
    thisWeek: all.filter((o) => parseDate(o.createdAt) >= startOfWeek).length,
    thisMonth: all.filter((o) => parseDate(o.createdAt) >= startOfMonth).length,
  };
}
