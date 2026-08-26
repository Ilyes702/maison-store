import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { WhatsAppButton } from "./whatsapp-button";
import { getSettings } from "@/lib/data/settings";
import { getAllCategories } from "@/lib/data/products";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getAllCategories(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar storeName={settings.storeName} />
      <main className="flex-1">{children}</main>
      <Footer
        storeName={settings.storeName}
        categories={categories}
        instagram={settings.instagram}
        facebook={settings.facebook}
        email={settings.email}
        phone={settings.phone}
      />
      <WhatsAppButton phone={settings.whatsapp} />
    </div>
  );
}
