import { useState } from "react";
import { UserPlus, Search, MessageSquare } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

type FriendStatus = "online" | "in-game" | "idle" | "offline";

interface Friend {
  name: string;
  initials: string;
  status: FriendStatus;
  activity: string;
}

const friends: Friend[] = [
  { name: "Aria", initials: "AR", status: "in-game", activity: "Playing Starfall Protocol" },
  { name: "Kael", initials: "KA", status: "online", activity: "Browsing the store" },
  { name: "Mira", initials: "MI", status: "online", activity: "In a voice call" },
  { name: "Juno", initials: "JU", status: "idle", activity: "Away for 12 minutes" },
  { name: "Sage", initials: "SA", status: "offline", activity: "Last seen 2h ago" },
  { name: "Ren", initials: "RE", status: "offline", activity: "Last seen yesterday" },
];

const TABS = ["Online", "All", "Pending", "Blocked"] as const;
type Tab = (typeof TABS)[number];

const statusDot: Record<FriendStatus, string> = {
  online: "bg-emerald-500",
  "in-game": "bg-blurple",
  idle: "bg-amber-500",
  offline: "bg-muted-foreground",
};

const statusLabel: Record<FriendStatus, string> = {
  online: "Online",
  "in-game": "In game",
  idle: "Idle",
  offline: "Offline",
};

/**
 * Friends list with tab filtering and a mock "add friend" banner.
 * Previews the future friends/rich-presence backend.
 */
export function FriendsPage() {
  const [tab, setTab] = useState<Tab>("Online");
  const [query, setQuery] = useState("");

  const visible = friends.filter((friend) => {
    if (tab === "Online" && (friend.status === "offline")) return false;
    if (tab === "All" || tab === "Online") return friend.name.toLowerCase().includes(query.toLowerCase());
    return false;
  });

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Friends"
        description="See who's online and start a game together."
        actions={
          <button className="flex h-9 items-center gap-2 rounded-lg bg-blurple px-3 text-sm font-semibold text-blurple-foreground transition-colors hover:bg-blurple/90">
            <UserPlus className="size-4" />
            Add Friend
          </button>
        }
      />

      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
          <div className="flex h-8 w-full max-w-xs items-center gap-2 rounded-md bg-black/30 px-2.5 text-muted-foreground">
            <Search className="size-4 shrink-0" />
            <input
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search friends"
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
          </div>
          <p className="ml-auto hidden text-xs text-muted-foreground sm:block">
            Send a friend request to start chatting
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 pb-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
              tab === t
                ? "bg-white/10 text-foreground"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        <ul className="mt-2 space-y-1">
          {visible.map((friend) => (
            <li
              key={friend.name}
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/5"
            >
              <div className="relative">
                <span className="flex size-9 items-center justify-center rounded-full bg-blurple/25 text-xs font-semibold text-blurple">
                  {friend.initials}
                </span>
                <span
                  className={cn(
                    "absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-surface-3",
                    statusDot[friend.status],
                  )}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{friend.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {statusLabel[friend.status]}
                  {friend.activity && friend.status !== "offline" && ` · ${friend.activity}`}
                </p>
              </div>
              <button
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                aria-label={`Message ${friend.name}`}
                title={`Message ${friend.name}`}
              >
                <MessageSquare className="size-4" />
              </button>
            </li>
          ))}
        </ul>
        {visible.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No friends match this view.
          </p>
        )}
      </div>
    </div>
  );
}
