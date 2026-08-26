"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = { name: string; slug: string };
type Color = { id: string; name: string; hex: string };
type SizeOpt = { id: string; label: string };

export function ShopFilters({
  categories,
  colors,
  sizes,
}: {
  categories: Category[];
  colors: Color[];
  sizes: SizeOpt[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [panelOpen, setPanelOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("q") || "");

  function updateParams(mutator: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutator(params);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function toggleListParam(key: string, value: string) {
    updateParams((params) => {
      const current = params.get(key)?.split(",").filter(Boolean) || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (next.length > 0) params.set(key, next.join(","));
      else params.delete(key);
    });
  }

  const activeCategory = searchParams.get("category") || "";
  const activeColors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
  const activeSizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
  const activeSale = searchParams.get("sale") === "1";
  const activeSort = searchParams.get("sort") || "newest";

  const hasActiveFilters =
    activeCategory || activeColors.length || activeSizes.length || activeSale;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            updateParams((params) => {
              if (search) params.set("q", search);
              else params.delete("q");
            });
          }}
        >
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن منتج... مثلاً hoodie"
            className="w-full rounded-full border border-line bg-paper py-3 pr-11 pl-4 text-sm outline-none transition-colors focus:border-ink"
          />
        </form>

        <div className="flex gap-2">
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-3 text-sm transition-colors",
              hasActiveFilters ? "border-ink bg-ink text-paper" : "border-line text-ink-soft"
            )}
          >
            <SlidersHorizontal size={15} />
            فلاتر
          </button>

          <select
            value={activeSort}
            onChange={(e) =>
              updateParams((params) => params.set("sort", e.target.value))
            }
            className="rounded-full border border-line bg-paper px-4 py-3 text-sm text-ink-soft outline-none"
          >
            <option value="newest">الأحدث</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
            <option value="popular">الأكثر رواجاً</option>
          </select>
        </div>
      </div>

      {panelOpen && (
        <div className="animate-fade-up space-y-5 rounded-2xl border border-line bg-paper p-5">
          <div>
            <p className="mb-2 text-xs font-bold text-ink-soft">التصنيف</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() =>
                    updateParams((params) => {
                      if (activeCategory === c.slug) params.delete("category");
                      else params.set("category", c.slug);
                    })
                  }
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                    activeCategory === c.slug
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink-soft hover:border-ink"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {colors.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold text-ink-soft">اللون</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleListParam("colors", c.id)}
                    aria-label={c.name}
                    className={cn(
                      "h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-paper transition-all",
                      activeColors.includes(c.id) ? "ring-ink" : "ring-transparent"
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold text-ink-soft">المقاس</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleListParam("sizes", s.id)}
                    className={cn(
                      "h-9 min-w-9 rounded-full border px-3 text-xs transition-colors",
                      activeSizes.includes(s.id)
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-ink-soft hover:border-ink"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="flex w-fit items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={activeSale}
              onChange={() =>
                updateParams((params) => {
                  if (activeSale) params.delete("sale");
                  else params.set("sale", "1");
                })
              }
              className="h-4 w-4 accent-accent"
            />
            المنتجات المخفضة فقط
          </label>

          {hasActiveFilters && (
            <button
              onClick={() =>
                startTransition(() => router.push(pathname))
              }
              className="flex items-center gap-1 text-xs text-sale hover:underline"
            >
              <X size={13} /> مسح كل الفلاتر
            </button>
          )}
        </div>
      )}
    </div>
  );
}
