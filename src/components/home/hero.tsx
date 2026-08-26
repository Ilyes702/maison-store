import Image from "next/image";
import { LinkButton } from "@/components/ui/button";

export function Hero({
  title,
  subtitle,
  image,
  cta,
}: {
  title: string;
  subtitle: string;
  image?: string | null;
  cta: string;
}) {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-5 pt-8 md:grid-cols-2 md:gap-4 md:px-8 md:pt-4">
        <div className="relative z-10 order-2 md:order-1 animate-fade-up">
          <span className="mb-4 inline-block text-xs font-bold tracking-[0.25em] text-accent">
            مجموعة خريف — شتاء
          </span>
          <h1 className="font-display text-4xl leading-[1.15] text-ink sm:text-5xl lg:text-[3.4rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
            {subtitle}
          </p>
          <div className="mt-8 flex gap-4">
            <LinkButton href="/shop" size="lg">{cta}</LinkButton>
            <LinkButton href="/shop?category=new-collection" variant="outline" size="lg">
              المجموعة الجديدة
            </LinkButton>
          </div>
        </div>

        <div className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-3xl bg-paper-dim md:order-2 md:aspect-[3/4]">
          {image ? (
            <Image
              src={image}
              alt="أحدث مجموعة أزياء"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="animate-fade-up object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone">
              صورة المجموعة
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
