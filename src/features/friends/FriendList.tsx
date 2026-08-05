import { useMemo } from "react";

import type { Friend, FriendStatus } from "./friends-data";
import { FriendCard } from "./FriendCard";
import { statusGroupLabel, statusPriority } from "./presence";
import { cn } from "@/lib/utils";

const STATUS_ORDER: FriendStatus[] = ["in-game", "online", "idle", "offline"];

interface FriendListProps {
  friends: Friend[];
  emptyMessage: string;
}

/**
 * Grouped friend list — In Game / Online / Idle / Offline. Grouping is
 * the product statement: the page answers "who's playing and can we
 * join?" before anything else. Group headers animate in with their
 * cards.
 */
export function FriendList({ friends, emptyMessage }: FriendListProps) {
  const groups = useMemo(() => {
    const grouped = new Map<FriendStatus, Friend[]>();
    for (const status of STATUS_ORDER) {
      grouped.set(status, []);
    }
    for (const friend of friends) {
      grouped.get(friend.status)?.push(friend);
    }
    return [...grouped.entries()].sort(
      ([a], [b]) => statusPriority[a] - statusPriority[b],
    );
  }, [friends]);

  return (
    <div className="space-y-6">
      {groups.map(([status, list]) =>
        list.length === 0 ? null : (
          <section key={status}>
            <h2 className="mb-2 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {statusGroupLabel(status)}
              <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px]">{list.length}</span>
            </h2>
            <ul className={cn("space-y-2")}>
              {list.map((friend, index) => (
                <FriendCard key={friend.id} friend={friend} index={index} />
              ))}
            </ul>
          </section>
        ),
      )}

      {friends.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  );
}
