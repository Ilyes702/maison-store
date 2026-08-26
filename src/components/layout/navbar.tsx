import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { MobileMenu } from "./mobile-menu";
import { NavbarSticky } from "./navbar-sticky";
import { CartCount } from "./cart-count";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/shop?category=women", label: "نساء" },
  { href: "/shop?category=men", label: "رجال" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Navbar({ storeName = "MAISON" }: { storeName?: string }) {
  return (
    <NavbarSticky>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <MobileMenu links={links} />
          <Link href="/" className="font-display text-2xl tracking-wide">
            {storeName}
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-ink-soft transition-colors hover:text-ink after:absolute after:-bottom-1 after:right-0 after:h-px after:w-0 after:bg-ink after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/shop" aria-label="بحث" className="p-1">
            <Search size={20} />
          </Link>
          <Link href="/cart" aria-label="السلة" className="relative p-1">
            <ShoppingBag size={20} />
            <CartCount />
          </Link>
        </div>
      </div>
    </NavbarSticky>
  );
}
