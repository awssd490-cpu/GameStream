import { cn } from "@/lib/utils";

/** Shimmering placeholder matching FriendCard geometry. */
function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-white/10", className)} />;
}

export function FriendSkeleton() {
  return (
    <li className="overflow-hidden rounded-xl border border-border bg-card">
      <SkeletonBlock className="h-20 w-full rounded-none rounded-t-xl" />
      <div className="p-3">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="size-10 rounded-full" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <SkeletonBlock className="h-3.5 w-28" />
            <SkeletonBlock className="h-3 w-40" />
          </div>
          <SkeletonBlock className="h-6 w-12" />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <SkeletonBlock key={i} className="size-8" />
            ))}
          </div>
          <SkeletonBlock className="size-8" />
        </div>
      </div>
    </li>
  );
}

export function FriendListSkeleton() {
  return (
    <div className="space-y-6">
      {["In Game", "Online", "Idle", "Offline"].map((group) => (
        <section key={group}>
          <SkeletonBlock className="mb-2 h-3 w-20" />
          <ul className="space-y-2">
            {[0, 1].map((i) => (
              <FriendSkeleton key={i} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
