import { LucideIcon, PackageSearch } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon: Icon = PackageSearch,
  action,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="rounded-full bg-paper-dim p-4">
        <Icon size={28} className="text-stone" />
      </div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {description && <p className="max-w-xs text-sm text-stone">{description}</p>}
      {action}
    </div>
  );
}
