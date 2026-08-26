export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton aspect-[3/4] w-full rounded-2xl" />
      <div className="skeleton h-3 w-3/4 rounded-full" />
      <div className="skeleton h-3 w-1/3 rounded-full" />
    </div>
  );
}
