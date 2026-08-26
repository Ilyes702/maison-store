import Image from "next/image";
import { LinkButton } from "@/components/ui/button";

export function PromoBanner({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image?: string | null;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-ink">
        {image && (
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
        )}
        <div className="relative z-10 flex flex-col items-center gap-4 px-6 py-16 text-center text-paper md:py-24">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">{title}</h2>
          <p className="max-w-md text-paper/70">{subtitle}</p>
          <LinkButton href="/shop" variant="secondary" size="lg" className="mt-2">
            اكتشف العروض
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
