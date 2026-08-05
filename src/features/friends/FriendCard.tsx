import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Gamepad2, MessageSquare, Users } from "lucide-react";

import type { Friend } from "./friends-data";
import { activeSessionForFriend } from "@/features/sessions/sessions-data";
import { GAME_ACTIONS, GameActionButton } from "./game-actions";
import { StatusAvatar, statusGroupLabel } from "./presence";
import { useFriendsStore } from "@/stores/friends-store";
import { cn } from "@/lib/utils";

function formatElapsed(startedAt: number): string {
  const minutes = Math.max(0, Math.round((Date.now() - startedAt) / 60_000));
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatLastSeen(lastSeenAt: number): string {
  const minutes = Math.max(0, Math.round((Date.now() - lastSeenAt) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface FriendCardProps {
  friend: Friend;
  index?: number;
}

/**
 * The core Friend Card. Memoized so navigation / filtering only
 * re-renders changed cards. Gaming-first layout: an in-game friend
 * shows a game-art strip with rich presence (game, activity, elapsed,
 * platform, party), plus the five game actions. Generic chat lives in a
 * small overflow affordance — gaming is the point of this screen.
 */
export const FriendCard = memo(function FriendCard({ friend, index = 0 }: FriendCardProps) {
  const openProfile = useFriendsStore((s) => s.openProfile);
  const inGame = friend.status === "in-game";
  const hasPresence = Boolean(friend.presence);
  const activeSession = activeSessionForFriend(friend.id);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-white/15"
    >
      {/* Game art strip for in-game friends */}
      {inGame && friend.presence && (
        <button
          onClick={() => openProfile(friend.id)}
          className={cn(
            "relative block h-20 w-full overflow-hidden bg-gradient-to-br text-left",
            friend.presence.tint,
          )}
          aria-label={`View ${friend.name}'s profile`}
        >
          <Gamepad2 className="absolute right-4 top-1/2 size-10 -translate-y-1/2 text-white/25 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.25} />
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-semibold text-white">
            <span className="size-1.5 rounded-full bg-red-500" />
            {friend.presence.game}
          </div>
        </button>
      )}

      <div className="p-3">
        {/* Identity row */}
        <div className="flex items-center gap-3">
          <button onClick={() => openProfile(friend.id)} aria-label={`Open ${friend.name}'s profile`} className="shrink-0">
            <StatusAvatar initials={friend.initials} status={friend.status} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold">{friend.name}</p>
              {friend.partyReady && (
                <span className="shrink-0 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-500">
                  Party ready
                </span>
              )}
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
              {inGame ? (
                <>
                  <Gamepad2 className="size-3 shrink-0 text-blurple" />
                  <span className="truncate">{friend.presence?.detail ?? "Playing"}</span>
                </>
              ) : (
                <>
                  <Clock className="size-3 shrink-0" />
                  <span className="truncate">
                    {friend.status === "offline"
                      ? `Last seen ${formatLastSeen(friend.lastSeenAt)}`
                      : `${statusGroupLabel(friend.status)} · ${friend.location ?? "Unknown"}`}
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <span className="hidden items-center gap-1 rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] text-muted-foreground sm:flex">
              <Gamepad2 className="size-3" />
              {formatElapsed(friend.presence?.startedAt ?? friend.lastSeenAt)}
            </span>
          </div>
        </div>

        {/* Current session strip (data-only integration with sessions) */}
        {activeSession && (
          <Link
            to="/sessions"
            className="mt-2.5 flex items-center gap-2 rounded-lg border border-border bg-surface-3/50 px-2.5 py-1.5 transition-colors hover:border-blurple/40"
            aria-label={`View ${activeSession.title} session`}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blurple/40 to-surface-4">
              <Gamepad2 className="size-3.5 text-white/80" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{activeSession.title}</p>
              <p className="truncate text-[10px] text-muted-foreground">
                {activeSession.size}/{activeSession.capacity} in party
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-red-400">
              <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
              Live
            </span>
          </Link>
        )}

        {/* Game actions row */}
        <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
          <div className="flex items-center gap-1">
            {GAME_ACTIONS.map((action) => (
              <GameActionButton key={action.id} action={action} size="sm" />
            ))}
          </div>
          <div className="flex items-center gap-1">
            {hasPresence && friend.presence?.party && (
              <span className="flex items-center gap-1 rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] text-muted-foreground" title="Party size">
                <Users className="size-3" />
                {friend.presence.party}
              </span>
            )}
            <button
              onClick={() => openProfile(friend.id)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              title={`View ${friend.name}'s profile`}
              aria-label={`View ${friend.name}'s profile`}
            >
              <MessageSquare className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
});
