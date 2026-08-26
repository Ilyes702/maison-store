import Link from "next/link";
import Image from "next/image";

export function CategoriesSection({
  categories,
}: {
  categories: { name: string; slug: string; image: string | null }[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-3xl text-ink">تسوّق حسب التصنيف</h2>
        <Link href="/shop" className="text-sm text-accent hover:underline">
          عرض الكل ←
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 thin-scroll md:grid md:grid-cols-4 md:overflow-visible">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="group relative aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-2xl bg-paper-dim md:w-auto"
          >
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="240px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-ink/10" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <span className="absolute bottom-4 right-4 font-display text-lg text-paper">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
