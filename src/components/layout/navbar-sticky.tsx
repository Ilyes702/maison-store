"use client";

import { useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function NavbarSticky({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-line bg-paper/90 backdrop-blur-md shadow-sm"
          : "border-transparent bg-paper/60 backdrop-blur-sm"
      )}
    >
      {children}
    </header>
  );
}
