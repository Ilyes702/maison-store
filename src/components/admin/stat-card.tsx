import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "accent" | "warning" | "danger";
}) {
  const tones = {
    default: "bg-paper text-ink",
    accent: "bg-accent-soft text-accent",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-600",
  };
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-full", tones[tone])}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs text-stone">{label}</p>
    </div>
  );
}
