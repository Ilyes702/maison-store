import { db } from "@/db";
import { settings, homepage } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_noStore } from "next/cache";

export async function getSettings() {
  unstable_noStore();
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
      deliveryInfo: "ط§ظ„ط¯ظپط¹ ط¹ظ†ط¯ ط§ظ„ط§ط³طھظ„ط§ظ…",
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
      heroTitle: "ط®ط²ط§ظ†طھظƒ ط§ظ„ط¬ط¯ظٹط¯ط© طھط¨ط¯ط£ ظ…ظ† ظ‡ظ†ط§",
      heroSubtitle: "ظ‚ط·ط¹ ظ…ط®طھط§ط±ط© ط¨ط¹ظ†ط§ظٹط© ظ„ط£ط³ظ„ظˆط¨ ظٹظˆظ…ظٹ ط£ظ†ظٹظ‚ ظˆط¹طµط±ظٹ",
      heroImage: "",
      heroCta: "طھط³ظˆظ‚ ط§ظ„ط¢ظ†",
      promoTitle: "طھط®ظپظٹط¶ط§طھ طھطµظ„ ط¥ظ„ظ‰ 30%",
      promoSubtitle: "ظ„ظپطھط±ط© ظ…ط­ط¯ظˆط¯ط© ط¹ظ„ظ‰ ظ…ط¬ظ…ظˆط¹ط© ظ…ط®طھط§ط±ط©",
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


