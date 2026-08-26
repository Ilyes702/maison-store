import { SiteShell } from "@/components/layout/site-shell";
import { CartClient } from "@/components/shop/cart-client";

export const metadata = { title: "سلة التسوق" };

export default function CartPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <h1 className="font-display text-3xl text-ink mb-8">سلة التسوق</h1>
        <CartClient />
      </div>
    </SiteShell>
  );
}
