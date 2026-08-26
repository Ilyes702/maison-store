import Link from "next/link";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9V10.5H8v3h2.42V21h3.08z" />
    </svg>
  );
}

export function Footer({
  storeName = "MAISON",
  categories = [] as { name: string; slug: string }[],
  instagram,
  facebook,
  email,
  phone,
}: {
  storeName?: string;
  categories?: { name: string; slug: string }[];
  instagram?: string | null;
  facebook?: string | null;
  email?: string | null;
  phone?: string | null;
}) {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-2xl">{storeName}</h3>
            <p className="mt-3 text-sm text-paper/60">
              أزياء عصرية مصممة لتعكس شخصيتك، جودة تدوم وأسلوب لا يشيخ.
            </p>
            <div className="mt-4 flex gap-3">
              {instagram && (
                <Link href={instagram} target="_blank" aria-label="Instagram" className="opacity-70 hover:opacity-100">
                  <InstagramIcon />
                </Link>
              )}
              {facebook && (
                <Link href={facebook} target="_blank" aria-label="Facebook" className="opacity-70 hover:opacity-100">
                  <FacebookIcon />
                </Link>
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-paper/80">روابط</h4>
            <ul className="flex flex-col gap-2 text-sm text-paper/60">
              <li><Link href="/shop" className="hover:text-paper">المتجر</Link></li>
              <li><Link href="/about" className="hover:text-paper">من نحن</Link></li>
              <li><Link href="/contact" className="hover:text-paper">تواصل معنا</Link></li>
              <li><Link href="/cart" className="hover:text-paper">السلة</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-paper/80">التصنيفات</h4>
            <ul className="flex flex-col gap-2 text-sm text-paper/60">
              {categories.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link href={`/shop?category=${c.slug}`} className="hover:text-paper">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-paper/80">تواصل معنا</h4>
            <ul className="flex flex-col gap-2 text-sm text-paper/60">
              {phone && <li dir="ltr" className="text-right">{phone}</li>}
              {email && <li>{email}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-paper/10 pt-6 text-xs text-paper/40 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.</p>
          <p>صنع بعناية للسوق المغربي 🇲🇦</p>
        </div>
      </div>
    </footer>
  );
}
