import { SiteShell } from "@/components/layout/site-shell";
import { CheckoutClient } from "@/components/shop/checkout-client";
import { getSettings } from "@/lib/data/settings";

export const metadata = { title: "إتمام الطلب" };

export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <h1 className="font-display text-3xl text-ink mb-8">إتمام الطلب</h1>
        <CheckoutClient deliveryInfo={settings.deliveryInfo || "الدفع عند الاستلام"} />
      </div>
    </SiteShell>
  );
}
