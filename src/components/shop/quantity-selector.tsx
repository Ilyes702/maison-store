"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  value,
  onChange,
  max = 99,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-line">
      <button
        type="button"
        aria-label="إنقاص الكمية"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-ink disabled:opacity-30"
        disabled={value <= 1}
      >
        <Minus size={15} />
      </button>
      <span className="w-8 text-center text-sm font-bold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="زيادة الكمية"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-ink disabled:opacity-30"
        disabled={value >= max}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
