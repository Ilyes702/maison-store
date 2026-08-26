import {
  pgTable,
  text,
  integer,
  real,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ---------- Admin ----------
export const admins = pgTable("admins", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Categories ----------
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  sortOrder: integer("sort_order").default(0),
});

// ---------- Colors ----------
export const colors = pgTable("colors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  hex: text("hex").notNull(),
});

// ---------- Sizes ----------
export const sizes = pgTable("sizes", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").default(0),
});

// ---------- Products ----------
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  description: text("description"),
  categoryId: text("category_id").references(() => categories.id),
  price: real("price").notNull(),
  originalPrice: real("original_price"),
  sku: text("sku"),
  stock: integer("stock").default(0),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  isBestSeller: boolean("is_best_seller").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Product Images ----------
export const productImages = pgTable("product_images", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  colorId: text("color_id").references(() => colors.id),
  sortOrder: integer("sort_order").default(0),
});

// ---------- Product <-> Color ----------
export const productColors = pgTable("product_colors", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  colorId: text("color_id")
    .notNull()
    .references(() => colors.id),
});

// ---------- Product <-> Size ----------
export const productSizes = pgTable("product_sizes", {
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
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  notes: text("notes"),
  total: real("total").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Order Items ----------
export const orderItems = pgTable("order_items", {
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

// ---------- Store Settings ----------
export const settings = pgTable("settings", {
  id: text("id").primaryKey(),
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
  codEnabled: boolean("cod_enabled").default(true),
});

// ---------- Homepage ----------
export const homepage = pgTable("homepage", {
  id: text("id").primaryKey(),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroImage: text("hero_image"),
  heroCta: text("hero_cta"),
  promoTitle: text("promo_title"),
  promoSubtitle: text("promo_subtitle"),
  promoImage: text("promo_image"),
});