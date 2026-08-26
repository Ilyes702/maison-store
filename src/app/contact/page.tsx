import { SiteShell } from "@/components/layout/site-shell";
import { getSettings } from "@/lib/data/settings";
import { Phone, Mail, MapPin } from "lucide-react";

export const metadata = { title: "تواصل معنا" };

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <h1 className="font-display text-4xl text-ink mb-6">تواصل معنا</h1>
        <p className="mb-8 leading-relaxed text-ink-soft">
          لديك سؤال عن طلب أو منتج؟ فريقنا هنا لمساعدتك في أي وقت.
        </p>

        <div className="space-y-4">
          {settings.phone && (
            <div className="flex items-center gap-3 rounded-xl border border-line p-4">
              <Phone size={18} className="text-accent" />
              <span dir="ltr" className="text-sm">{settings.phone}</span>
            </div>
          )}
          {settings.email && (
            <div className="flex items-center gap-3 rounded-xl border border-line p-4">
              <Mail size={18} className="text-accent" />
              <span className="text-sm">{settings.email}</span>
            </div>
          )}
          {settings.address && (
            <div className="flex items-center gap-3 rounded-xl border border-line p-4">
              <MapPin size={18} className="text-accent" />
              <span className="text-sm">{settings.address}</span>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
