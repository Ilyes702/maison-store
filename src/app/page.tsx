import { SiteShell } from "@/components/layout/site-shell";
import { Hero } from "@/components/home/hero";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { PromoBanner } from "@/components/home/promo-banner";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { getHomepageContent } from "@/lib/data/settings";
import {
  getAllCategories,
  getFeaturedProducts,
  getNewArrivals,
} from "@/lib/data/products";

export default async function HomePage() {
  const [content, categories, featured, newArrivals] = await Promise.all([
    getHomepageContent(),
    getAllCategories(),
    getFeaturedProducts(),
    getNewArrivals(8),
  ]);

  return (
    <SiteShell>
      <Hero
        title={content.heroTitle || ""}
        subtitle={content.heroSubtitle || ""}
        image={content.heroImage}
        cta={content.heroCta || "تسوق الآن"}
      />

      <CategoriesSection categories={categories} />

      <FeaturedProductsSection title="منتجات مختارة" products={featured} />

      <PromoBanner
        title={content.promoTitle || ""}
        subtitle={content.promoSubtitle || ""}
        image={content.promoImage}
      />

      <FeaturedProductsSection
        title="المجموعة الجديدة"
        products={newArrivals}
        viewAllHref="/shop?new=1"
      />

      <WhyChooseUs />
    </SiteShell>
  );
}
