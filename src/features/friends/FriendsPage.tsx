import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Search, SlidersHorizontal, UserPlus, X } from "lucide-react";

import { friends as allFriends, type FriendStatus } from "./friends-data";
import { FriendList } from "./FriendList";
import { FriendListSkeleton } from "./FriendSkeleton";
import { FriendProfileDrawer } from "./FriendProfileDrawer";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

type PresenceFilter = "all" | "online" | "in-game" | "idle" | "offline";
type PlatformFilter = "all" | "pc" | "console" | "mobile";

const PRESENCE_FILTERS: { id: PresenceFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "online", label: "Online" },
  { id: "in-game", label: "In Game" },
  { id: "idle", label: "Idle" },
  { id: "offline", label: "Offline" },
];

const PLATFORM_FILTERS: { id: PlatformFilter; label: string }[] = [
  { id: "all", label: "All platforms" },
  { id: "pc", label: "PC" },
  { id: "console", label: "Console" },
  { id: "mobile", label: "Mobile" },
];

function matchesPresence(status: FriendStatus, filter: PresenceFilter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "online":
      return status === "online" || status === "in-game" || status === "idle";
    case "in-game":
      return status === "in-game";
    case "idle":
      return status === "idle";
    case "offline":
      return status === "offline";
  }
}

/**
 * Friends — the gaming-first "who's playing, how do we play together"
 * surface. Search, presence filters, and a platform filter compose
 * against the mock catalog. A short simulated fetch drives the loading
 * skeletons, demonstrating the async seam the presence service will fill.
 *
 * The five game actions (Join / Watch / Remote Play / Voice / Party)
 * are UI placeholders only — wired by later milestones.
 */
export function FriendsPage() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [presence, setPresence] = useState<PresenceFilter>("all");
  const [platform, setPlatform] = useState<PlatformFilter>("all");

  // Simulated async load — skeletons first, then the list. This mirrors
  // the future presence/network seam without any networking today.
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allFriends.filter((friend) => {
      const matchesQuery = q === "" || friend.name.toLowerCase().includes(q);
      const matchesPresenceFilter = matchesPresence(friend.status, presence);
      const matchesPlatform = platform === "all" || friend.platform === platform;
      return matchesQuery && matchesPresenceFilter && matchesPlatform;
    });
  }, [query, presence, platform]);

  const inGameCount = allFriends.filter((f) => f.status === "in-game").length;
  const onlineCount = allFriends.filter((f) => f.status !== "offline").length;

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Friends"
        description="Who's playing right now — and how you can play together."
        actions={
          <button className="flex h-9 items-center gap-2 rounded-lg bg-blurple px-3 text-sm font-semibold text-blurple-foreground transition-colors hover:bg-blurple/90">
            <UserPlus className="size-4" />
            Add Friend
          </button>
        }
      />

      {/* Status summary */}
      <div className="flex flex-wrap items-center gap-2 px-6 pb-3">
        <span className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-blurple" />
          {inGameCount} in game
        </span>
        <span className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {onlineCount} online
        </span>
        <span className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-muted-foreground">
          <Gamepad2 className="size-3.5" />
          {allFriends.length} total
        </span>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-2 px-6 pb-4">
        <div className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg bg-black/30 px-2.5 text-muted-foreground transition-colors focus-within:bg-black/40 focus-within:text-foreground">
          <Search className="size-4 shrink-0" />
          <input
            className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Search friends"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Presence filter chips */}
        <div className="flex items-center gap-1">
          {PRESENCE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setPresence(f.id)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                presence === f.id
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Platform filter */}
        <div className="ml-auto flex items-center gap-1.5">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <select
            value={platform}
            onChange={(e) => setPlatform(e.currentTarget.value as PlatformFilter)}
            className="h-8 rounded-md border border-border bg-surface-3 px-2 text-sm text-foreground outline-none transition-colors hover:bg-white/5"
            aria-label="Filter by platform"
          >
            {PLATFORM_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <FriendListSkeleton />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <FriendList friends={visible} emptyMessage="No friends match this view." />
          </motion.div>
        )}
      </div>

      {/* Profile drawer (mounted only while open) */}
      <FriendProfileDrawer />
    </div>
  );
}
