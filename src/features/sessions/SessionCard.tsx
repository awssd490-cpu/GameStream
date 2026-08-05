import { memo } from "react";
import { motion } from "framer-motion";

import { memberList, sessionById } from "./sessions-data";
import { gameForSession } from "./session-primitives";
import { SESSION_ACTIONS, SessionActionButton } from "./session-actions";
import { GameArt, PartyAvatars, SessionBadges, SessionStatusPill } from "./session-primitives";
import { capacityPercent } from "./session-helpers";
import { hubById } from "@/features/hubs/hubs-data";
import { useSessionsStore } from "@/stores/sessions-store";

interface SessionCardProps {
  sessionId: string;
  index?: number;
}

/**
 * Game Session card — memoized so filtering/sorting only re-renders
 * changed cards. Art, live status, difficulty, region, latency, party
 * capacity, member avatars and the session actions (placeholders).
 */
export const SessionCard = memo(function SessionCard({ sessionId, index = 0 }: SessionCardProps) {
  const openSession = useSessionsStore((s) => s.openSession);
  const session = sessionById(sessionId);
  if (!session) return null;

  const game = gameForSession(session);
  const members = memberList(session);
  const hub = session.hubId ? hubById(session.hubId) : undefined;
  const fill = capacityPercent(session.size, session.capacity);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
      className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-white/15"
    >
      <button
        onClick={() => openSession(session.id)}
        className="block w-full text-left"
        aria-label={`Open ${session.title} session`}
      >
        {/* Game artwork */}
        <div className="relative">
          <GameArt game={game} className="aspect-[16/7] w-full" />
          <div className="absolute left-2 top-2">
            <SessionStatusPill session={session} />
          </div>
          <div className="absolute right-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {game.title}
          </div>
        </div>

        <div className="p-3">
          {/* Title + party */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold">{session.title}</h3>
            <span className="shrink-0 rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-muted-foreground">
              {session.size}/{session.capacity}
            </span>
          </div>

          {/* Host + hub */}
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-blurple" />
            {memberList(session)[0]?.name ?? "Host"} · {hub?.name ?? "Public session"}
          </p>

          <SessionBadges className="mt-2" session={session} />

          {/* Capacity bar */}
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-blurple transition-all duration-300" style={{ width: `${fill}%` }} />
          </div>

          {/* Members + actions */}
          <div className="mt-3 flex items-center justify-between">
            <PartyAvatars members={members} size={session.size} capacity={session.capacity} />
            <div className="flex items-center gap-1">
              {SESSION_ACTIONS.slice(0, 3).map((action) => (
                <SessionActionButton key={action.id} action={action} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </button>
    </motion.li>
  );
});
