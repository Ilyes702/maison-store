import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/db";
import {
  admins,
  categories,
  colors,
  sizes,
  products,
  productImages,
  productColors,
  productSizes,
  settings,
  homepage,
} from "../src/db/schema";
import { generateId, slugify } from "../src/lib/utils";

const img = (seed: string, w = 900, h = 1150) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

async function main() {
  console.log("🌱 بدء تعبئة قاعدة البيانات ببيانات تجريبية...");

  // ---------- Admin account ----------
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@maison.ma";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const existingAdmin = await db.query.admins.findFirst({
    where: (a, { eq }) => eq(a.email, adminEmail),
  });
  if (!existingAdmin) {
    await db.insert(admins).values({
      id: generateId("admin_"),
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      name: "المدير",
    });
    console.log(`✔ تم إنشاء حساب المدير: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("↷ حساب المدير موجود مسبقاً، تم التخطي.");
  }

  // ---------- Settings ----------
  const existingSettings = await db.query.settings.findFirst({
    where: (s, { eq }) => eq(s.id, "main"),
  });
  if (!existingSettings) {
    await db.insert(settings).values({
      id: "main",
      storeName: "MAISON",
      currency: "MAD",
      phone: "+212600000000",
      email: "contact@maison.ma",
      whatsapp: "212600000000",
      instagram: "https://instagram.com/maison.ma",
      facebook: "https://facebook.com/maison.ma",
      address: "القنيطرة، المغرب",
      deliveryInfo: "الدفع عند الاستلام لجميع المدن المغربية",
      codEnabled: true,
    });
  }

  // ---------- Homepage content ----------
  const existingHome = await db.query.homepage.findFirst({
    where: (h, { eq }) => eq(h.id, "main"),
  });
  if (!existingHome) {
    await db.insert(homepage).values({
      id: "main",
      heroTitle: "خزانتك الجديدة تبدأ من هنا",
      heroSubtitle: "قطع مختارة بعناية لأسلوب يومي أنيق وعصري، بجودة تدوم وأسعار عادلة.",
      heroImage: img("hero-main", 1000, 1250),
      heroCta: "تسوق الآن",
      promoTitle: "تخفيضات تصل إلى 30%",
      promoSubtitle: "لفترة محدودة على مجموعة مختارة من القطع",
      promoImage: img("promo-banner", 1600, 700),
    });
  }

  // ---------- Categories ----------
  const categoryDefs = [
    { name: "رجال", seed: "cat-men" },
    { name: "نساء", seed: "cat-women" },
    { name: "المجموعة الجديدة", seed: "cat-new" },
    { name: "الأكثر مبيعاً", seed: "cat-best" },
    { name: "Hoodies", seed: "cat-hoodies" },
    { name: "T-Shirts", seed: "cat-tshirts" },
  ];
  const categoryIds: Record<string, string> = {};
  for (const [i, c] of categoryDefs.entries()) {
    const existing = await db.query.categories.findFirst({
      where: (cat, { eq }) => eq(cat.name, c.name),
    });
    if (existing) {
      categoryIds[c.name] = existing.id;
      continue;
    }
    const id = generateId("cat_");
    await db.insert(categories).values({
      id,
      name: c.name,
      slug: slugify(c.name) + "-" + id.slice(-4),
      image: img(c.seed, 600, 800),
      sortOrder: i,
    });
    categoryIds[c.name] = id;
  }

  // ---------- Colors ----------
  const colorDefs = [
    { name: "أسود", hex: "#15150f" },
    { name: "أبيض", hex: "#f7f5f0" },
    { name: "بيج", hex: "#d8cbb0" },
    { name: "كحلي", hex: "#26324a" },
    { name: "أخضر زيتوني", hex: "#4a5a3f" },
  ];
  const colorIds: Record<string, string> = {};
  for (const c of colorDefs) {
    const existing = await db.query.colors.findFirst({
      where: (col, { eq }) => eq(col.name, c.name),
    });
    if (existing) {
      colorIds[c.name] = existing.id;
      continue;
    }
    const id = generateId("col_");
    await db.insert(colors).values({ id, name: c.name, hex: c.hex });
    colorIds[c.name] = id;
  }

  // ---------- Sizes ----------
  const sizeDefs = ["S", "M", "L", "XL", "XXL"];
  const sizeIds: Record<string, string> = {};
  for (const [i, label] of sizeDefs.entries()) {
    const existing = await db.query.sizes.findFirst({
      where: (s, { eq }) => eq(s.label, label),
    });
    if (existing) {
      sizeIds[label] = existing.id;
      continue;
    }
    const id = generateId("sz_");
    await db.insert(sizes).values({ id, label, sortOrder: i });
    sizeIds[label] = id;
  }

  // ---------- Products ----------
  const existingProducts = await db.select().from(products);
  if (existingProducts.length === 0) {
    const productDefs = [
      {
        name: "Premium Oversized Hoodie",
        short: "هودي بقصة واسعة وقماش قطني ثقيل فاخر",
        desc: "هودي بريميوم بقصة Oversized عصرية، مصنوع من قطن ثقيل عالي الجودة يمنحك الدفء والراحة طوال اليوم. مناسب للإطلالات اليومية العصرية.",
        price: 299,
        original: 399,
        category: "Hoodies",
        colors: ["أسود", "بيج", "كحلي"],
        featured: true,
        isNew: true,
        best: true,
        seed: "hoodie",
      },
      {
        name: "Basic Oversized T-Shirt",
        short: "تيشيرت أساسي بقصة واسعة ومريحة",
        desc: "تيشيرت قطني 100% بقصة Oversized، تصميم بسيط يلائم كل الإطلالات، ألوان محايدة أنيقة.",
        price: 149,
        original: null,
        category: "T-Shirts",
        colors: ["أسود", "أبيض", "بيج"],
        featured: true,
        isNew: false,
        best: true,
        seed: "tshirt-basic",
      },
      {
        name: "Cargo Pants Utility",
        short: "بنطلون كارغو عملي بجيوب متعددة",
        desc: "بنطلون كارغو بتصميم عملي وأنيق، جيوب متعددة، قماش متين مقاوم للتجعد، مثالي للستايل الحضري.",
        price: 349,
        original: 449,
        category: "رجال",
        colors: ["كحلي", "أخضر زيتوني", "أسود"],
        featured: true,
        isNew: true,
        best: false,
        seed: "cargo",
      },
      {
        name: "Classic Denim Jacket",
        short: "جاكيت جينز كلاسيكي بقصة عصرية",
        desc: "جاكيت جينز بتصميم كلاسيكي يعاد تفسيره بقصة عصرية، خامة جينز متينة عالية الجودة تدوم طويلاً.",
        price: 449,
        original: 599,
        category: "المجموعة الجديدة",
        colors: ["كحلي", "أسود"],
        featured: false,
        isNew: true,
        best: false,
        seed: "denim",
      },
      {
        name: "Ribbed Knit Sweater",
        short: "سويتر محبوك بخطوط ضلعية أنيقة",
        desc: "سويتر دافئ محبوك بنسيج ضلعي أنيق، مثالي لفصل الخريف والشتاء، يمنحك مظهراً عصرياً بسيطاً.",
        price: 259,
        original: null,
        category: "نساء",
        colors: ["بيج", "أبيض", "أخضر زيتوني"],
        featured: false,
        isNew: false,
        best: true,
        seed: "sweater",
      },
      {
        name: "Wide Leg Trousers",
        short: "بنطلون واسع بخصر مرتفع",
        desc: "بنطلون بقصة واسعة وخصر مرتفع، قماش ناعم ذو ملمس فاخر، إطلالة أنيقة تناسب المكتب والخروجات.",
        price: 279,
        original: 329,
        category: "نساء",
        colors: ["أسود", "بيج"],
        featured: true,
        isNew: false,
        best: false,
        seed: "trousers",
      },
      {
        name: "Essential Crewneck Sweatshirt",
        short: "سويتشيرت أساسي بياقة دائرية",
        desc: "سويتشيرت قطني بياقة دائرية كلاسيكية، تصميم أساسي يناسب كل خزانة ملابس عصرية.",
        price: 219,
        original: null,
        category: "Hoodies",
        colors: ["أسود", "كحلي", "أبيض"],
        featured: false,
        isNew: false,
        best: false,
        seed: "crewneck",
      },
      {
        name: "Structured Blazer",
        short: "بليزر بقصة منظمة وأنيقة",
        desc: "بليزر عصري بقصة منظمة، مثالي لإطلالات العمل أو المناسبات الأنيقة، خامة عالية الجودة.",
        price: 549,
        original: 699,
        category: "نساء",
        colors: ["أسود", "كحلي"],
        featured: true,
        isNew: true,
        best: false,
        seed: "blazer",
      },
    ];

    for (const p of productDefs) {
      const id = generateId("prod_");
      const slug = slugify(p.name) + "-" + id.slice(-5);

      await db.insert(products).values({
        id,
        name: p.name,
        slug,
        shortDescription: p.short,
        description: p.desc,
        categoryId: categoryIds[p.category] || null,
        price: p.price,
        originalPrice: p.original,
        sku: `SKU-${id.slice(-6).toUpperCase()}`,
        stock: 40,
        isFeatured: p.featured,
        isNew: p.isNew,
        isBestSeller: p.best,
        isActive: true,
      });

      // 2 images per product
      await db.insert(productImages).values([
        { id: generateId("img_"), productId: id, url: img(p.seed + "-1"), sortOrder: 0 },
        { id: generateId("img_"), productId: id, url: img(p.seed + "-2"), sortOrder: 1 },
      ]);

      for (const cName of p.colors) {
        if (colorIds[cName]) {
          await db.insert(productColors).values({
            id: generateId("pc_"),
            productId: id,
            colorId: colorIds[cName],
          });
        }
      }

      for (const sLabel of ["S", "M", "L", "XL", "XXL"]) {
        await db.insert(productSizes).values({
          id: generateId("ps_"),
          productId: id,
          sizeId: sizeIds[sLabel],
          stock: sLabel === "XXL" ? 0 : 15, // demo: XXL out of stock
        });
      }
    }
    console.log(`✔ تمت إضافة ${productDefs.length} منتجات تجريبية.`);
  } else {
    console.log("↷ توجد منتجات مسبقاً، تم التخطي.");
  }

  console.log("✅ اكتملت تعبئة قاعدة البيانات بنجاح.");
  console.log("—".repeat(30));
  console.log(`بيانات دخول لوحة التحكم:\n  البريد: ${adminEmail}\n  كلمة المرور: ${adminPassword}`);
  console.log("—".repeat(30));
}

main()
  .catch((err) => {
    console.error("❌ خطأ أثناء التعبئة:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
