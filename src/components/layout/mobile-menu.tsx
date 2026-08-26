"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type NavLink = { href: string; label: string };

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="فتح القائمة"
        className="p-2 -m-2"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] bg-paper animate-fade-up">
          <div className="flex items-center justify-between px-5 py-5 border-b border-line">
            <span className="font-display text-xl">القائمة</span>
            <button onClick={() => setOpen(false)} aria-label="إغلاق القائمة" className="p-2 -m-2">
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col px-5 py-6 gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-4 text-lg border-b border-line text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
