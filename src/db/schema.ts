import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ---------- Admin ----------
export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Categories ----------
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  sortOrder: integer("sort_order").default(0),
});

// ---------- Colors (global palette admin can manage) ----------
export const colors = sqliteTable("colors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  hex: text("hex").notNull(),
});

// ---------- Sizes (global list, e.g. S/M/L/XL/XXL) ----------
export const sizes = sqliteTable("sizes", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").default(0),
});

// ---------- Products ----------
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  description: text("description"),
  categoryId: text("category_id").references(() => categories.id),
  price: real("price").notNull(), // current/sale price
  originalPrice: real("original_price"), // null = no discount
  sku: text("sku"),
  stock: integer("stock").default(0),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  isNew: integer("is_new", { mode: "boolean" }).default(false),
  isBestSeller: integer("is_best_seller", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Product Images (ordered, optionally tied to a color) ----------
export const productImages = sqliteTable("product_images", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  colorId: text("color_id").references(() => colors.id),
  sortOrder: integer("sort_order").default(0),
});

// ---------- Product <-> Color availability ----------
export const productColors = sqliteTable("product_colors", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  colorId: text("color_id")
    .notNull()
    .references(() => colors.id),
});

// ---------- Product <-> Size availability ----------
export const productSizes = sqliteTable("product_sizes", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sizeId: text("size_id")
    .notNull()
    .references(() => sizes.id),
  stock: integer("stock").default(0),
});

// ---------- Orders ----------
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  notes: text("notes"),
  total: real("total").notNull(),
  status: text("status").notNull().default("new"),
  // new | contacted | confirmed | preparing | shipped | delivered | cancelled
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Order Items (snapshot of product at order time) ----------
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  productImage: text("product_image"),
  color: text("color"),
  size: text("size"),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

// ---------- Store Settings (singleton row id="main") ----------
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(), // "main"
  storeName: text("store_name").notNull().default("MAISON"),
  logo: text("logo"),
  currency: text("currency").notNull().default("MAD"),
  phone: text("phone"),
  email: text("email"),
  whatsapp: text("whatsapp"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  address: text("address"),
  deliveryInfo: text("delivery_info").default("الدفع عند الاستلام"),
  codEnabled: integer("cod_enabled", { mode: "boolean" }).default(true),
});

// ---------- Homepage content (singleton row id="main") ----------
export const homepage = sqliteTable("homepage", {
  id: text("id").primaryKey(), // "main"
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroImage: text("hero_image"),
  heroCta: text("hero_cta"),
  promoTitle: text("promo_title"),
  promoSubtitle: text("promo_subtitle"),
  promoImage: text("promo_image"),
});
