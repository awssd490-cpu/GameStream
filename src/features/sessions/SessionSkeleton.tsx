import { cn } from "@/lib/utils";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-white/10", className)} />;
}

/** Shimmering placeholder matching SessionCard geometry. */
export function SessionCardSkeleton() {
  return (
    <li className="overflow-hidden rounded-xl border border-border bg-card">
      <SkeletonBlock className="aspect-[16/7] w-full rounded-none rounded-t-xl" />
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <SkeletonBlock className="h-3.5 w-40" />
          <SkeletonBlock className="h-5 w-10" />
        </div>
        <SkeletonBlock className="h-3 w-32" />
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-5 w-14" />
          ))}
        </div>
        <SkeletonBlock className="h-1 w-full" />
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <SkeletonBlock key={i} className="size-7 rounded-full border-2 border-card" />
            ))}
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <SkeletonBlock key={i} className="size-8" />
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

export function SessionGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <SessionCardSkeleton key={i} />
      ))}
    </div>
  );
}
