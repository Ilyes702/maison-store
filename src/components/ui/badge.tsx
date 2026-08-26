import { cn } from "@/lib/utils";

type BadgeKind = "new" | "sale" | "best" | "neutral";

const styles: Record<BadgeKind, string> = {
  new: "bg-ink text-paper",
  sale: "bg-sale text-white",
  best: "bg-accent text-paper",
  neutral: "bg-paper text-ink border border-line",
};

export function Badge({
  kind = "neutral",
  className,
  children,
}: {
  kind?: BadgeKind;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide",
        styles[kind],
        className
      )}
    >
      {children}
    </span>
  );
}
