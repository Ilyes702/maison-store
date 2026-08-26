import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ProductDetailInteractive } from "@/components/shop/product-detail-interactive";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { getProductBySlug, getProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription || product.description || undefined,
    openGraph: {
      title: product.name,
      description: product.shortDescription || undefined,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (
    await getProducts({ categorySlug: product.category?.slug })
  ).filter((p) => p.slug !== product.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description || "",
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "MAD",
      price: product.price,
      availability:
        (product.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <SiteShell>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <nav className="mb-6 text-xs text-stone">
          <span>المتجر</span>
          {product.category && <span> / {product.category.name}</span>}
          <span> / {product.name}</span>
        </nav>

        <ProductDetailInteractive
          productId={product.id}
          slug={product.slug}
          name={product.name}
          price={product.price}
          originalPrice={product.originalPrice}
          images={product.images}
          colors={product.colors}
          sizes={product.sizes}
          stock={product.stock}
        />

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-lg text-ink mb-2">الوصف</h2>
            <p className="text-sm leading-relaxed text-ink-soft whitespace-pre-line">
              {product.description || product.shortDescription}
            </p>
          </div>
          <div className="rounded-2xl border border-line p-5 text-sm text-ink-soft">
            <p className="mb-2">✓ الدفع عند الاستلام</p>
            <p className="mb-2">✓ توصيل لجميع المدن المغربية</p>
            <p>✓ تأكيد الطلب عبر الهاتف قبل الشحن</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <FeaturedProductsSection title="قد يعجبك أيضاً" products={related} />
      )}
    </SiteShell>
  );
}
