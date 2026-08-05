import { AnimatePresence, motion } from "framer-motion";
import {
  Gamepad2,
  MessageSquare,
  Timer,
  Users,
  X,
} from "lucide-react";

import { friendById } from "./friends-data";
import { GAME_ACTIONS, GameActionButton } from "./game-actions";
import { StatusAvatar, statusGroupLabel } from "./presence";
import { useFriendsStore } from "@/stores/friends-store";
import { cn } from "@/lib/utils";

function formatLastSeen(lastSeenAt: number): string {
  const minutes = Math.max(0, Math.round((Date.now() - lastSeenAt) / 60_000));
  if (minutes < 60) return `${minutes} minutes ago`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  return `${Math.floor(h / 24)} day${h >= 48 ? "s" : ""} ago`;
}

function formatElapsed(startedAt: number): string {
  const minutes = Math.max(0, Math.round((Date.now() - startedAt) / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hour${h === 1 ? "" : "s"}` : `${h}h ${m}m`;
}

/**
 * Slide-over profile drawer. Rendered from the friends store's selected
 * friend id; AnimatePresence handles mount/unmount so it costs nothing
 * when closed. Rich presence gets room to breathe here, and the same
 * five game actions repeat for discoverability.
 */
export function FriendProfileDrawer() {
  const selectedId = useFriendsStore((s) => s.selectedFriendId);
  const closeProfile = useFriendsStore((s) => s.closeProfile);
  const friend = selectedId ? friendById(selectedId) : undefined;

  return (
    <AnimatePresence>
      {friend && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={closeProfile}
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${friend.name}'s profile`}
            className="fixed right-0 top-0 z-50 flex h-full w-[340px] max-w-[90vw] flex-col border-l border-border bg-surface-3 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold tracking-tight">Profile</h2>
              <button
                onClick={closeProfile}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                aria-label="Close profile"
                title="Close profile"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {/* Identity */}
              <div className="flex flex-col items-center gap-3 px-6 pt-6 text-center">
                <StatusAvatar initials={friend.initials} status={friend.status} size="lg" />
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{friend.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {friend.status === "offline"
                      ? `Last seen ${formatLastSeen(friend.lastSeenAt)}`
                      : `${statusGroupLabel(friend.status)} · ${friend.location ?? "Unknown"}`}
                  </p>
                </div>
              </div>

              {/* Rich presence */}
              {friend.presence && (
                <div className="px-4 pt-5">
                  <div className={cn("relative overflow-hidden rounded-xl border border-border bg-gradient-to-br", friend.presence.tint)}>
                    <div className="relative z-10 p-4">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="size-4 text-white" />
                        <span className="text-sm font-semibold text-white">{friend.presence.game}</span>
                      </div>
                      <p className="mt-1 text-xs text-white/80">{friend.presence.detail}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/80">
                        <span className="flex items-center gap-1 rounded bg-black/30 px-1.5 py-0.5">
                          <Timer className="size-3" />
                          {formatElapsed(friend.presence.startedAt)}
                        </span>
                        {friend.presence.party && (
                          <span className="flex items-center gap-1 rounded bg-black/30 px-1.5 py-0.5">
                            <Users className="size-3" />
                            Party {friend.presence.party}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Game actions */}
                  <p className="mt-4 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Play together
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {GAME_ACTIONS.map((action) => (
                      <button
                        key={action.id}
                        disabled={action.soon}
                        title={action.soon ? `${action.label} — coming with a later milestone` : action.description}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                          action.soon
                            ? "cursor-not-allowed border-border bg-white/[0.02] text-muted-foreground/50"
                            : "border-border bg-card hover:border-blurple hover:text-foreground",
                        )}
                      >
                        <action.icon className="size-4 shrink-0" />
                        <span className="truncate">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mutual hubs */}
              <div className="px-4 pt-5">
                <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Gaming Hubs
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {friend.hubs.map((hub) => (
                    <span key={hub.id} className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-muted-foreground">
                      <hub.icon className="size-3.5" />
                      {hub.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mutual friends */}
              <div className="px-4 pt-5">
                <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Friends
                </p>
                <p className="mt-2 px-1 text-sm text-muted-foreground">
                  {friend.mutualFriends} mutual friend{friend.mutualFriends === 1 ? "" : "s"}
                </p>
              </div>

              <div className="h-6" />
            </div>

            {/* Footer */}
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <GameActionButton action={GAME_ACTIONS[0]} />
                <GameActionButton action={GAME_ACTIONS[3]} />
                <div className="flex-1" />
                <button
                  className="flex h-9 items-center gap-2 rounded-lg bg-blurple px-3 text-sm font-semibold text-blurple-foreground transition-colors hover:bg-blurple/90"
                  aria-label={`Message ${friend.name}`}
                  title={`Message ${friend.name}`}
                >
                  <MessageSquare className="size-4" />
                  Message
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
