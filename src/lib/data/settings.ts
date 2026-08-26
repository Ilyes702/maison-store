import { db } from "@/db";
import { settings, homepage } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSettings() {
  const row = await db.query.settings.findFirst({
    where: eq(settings.id, "main"),
  });
  return (
    row || {
      id: "main",
      storeName: "MAISON",
      logo: null,
      currency: "MAD",
      phone: "",
      email: "",
      whatsapp: "",
      instagram: "",
      facebook: "",
      address: "",
      deliveryInfo: "الدفع عند الاستلام",
      codEnabled: true,
    }
  );
}

export async function updateSettings(data: Partial<typeof settings.$inferInsert>) {
  const existing = await db.query.settings.findFirst({
    where: eq(settings.id, "main"),
  });
  if (existing) {
    await db.update(settings).set(data).where(eq(settings.id, "main"));
  } else {
    await db.insert(settings).values({ id: "main", ...data } as any);
  }
}

export async function getHomepageContent() {
  const row = await db.query.homepage.findFirst({
    where: eq(homepage.id, "main"),
  });
  return (
    row || {
      id: "main",
      heroTitle: "خزانتك الجديدة تبدأ من هنا",
      heroSubtitle: "قطع مختارة بعناية لأسلوب يومي أنيق وعصري",
      heroImage: "",
      heroCta: "تسوق الآن",
      promoTitle: "تخفيضات تصل إلى 30%",
      promoSubtitle: "لفترة محدودة على مجموعة مختارة",
      promoImage: "",
    }
  );
}

export async function updateHomepageContent(
  data: Partial<typeof homepage.$inferInsert>
) {
  const existing = await db.query.homepage.findFirst({
    where: eq(homepage.id, "main"),
  });
  if (existing) {
    await db.update(homepage).set(data).where(eq(homepage.id, "main"));
  } else {
    await db.insert(homepage).values({ id: "main", ...data } as any);
  }
}
