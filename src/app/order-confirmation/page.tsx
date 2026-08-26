import { SiteShell } from "@/components/layout/site-shell";
import { LinkButton } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "تم استلام طلبك" };

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; total?: string }>;
}) {
  const sp = await searchParams;
  const total = sp.total ? Number(sp.total) : null;

  return (
    <SiteShell>
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-20 text-center md:px-8">
        <div className="animate-fade-up flex h-20 w-20 items-center justify-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="font-display mt-6 text-3xl text-ink">شكراً على طلبك ❤️</h1>
        <p className="mt-3 text-ink-soft">
          توصلنا بالطلب ديالك بنجاح. غادي نتاصلوا بيك قريباً باش نأكدوا الطلب.
        </p>

        {sp.order && (
          <div className="mt-8 w-full space-y-2 rounded-2xl border border-line p-6 text-sm">
            <div className="flex justify-between">
              <span className="text-stone">رقم الطلب</span>
              <span className="font-bold text-ink" dir="ltr">{sp.order}</span>
            </div>
            {total !== null && (
              <div className="flex justify-between border-t border-line pt-2">
                <span className="text-stone">الإجمالي</span>
                <span className="font-bold text-ink">{formatPrice(total)}</span>
              </div>
            )}
          </div>
        )}

        <LinkButton href="/shop" className="mt-8">
          العودة للمتجر
        </LinkButton>
      </div>
    </SiteShell>
  );
}
