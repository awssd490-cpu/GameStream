import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Copy } from "lucide-react";

import { memberList, sessionById } from "./sessions-data";
import { gameForSession } from "./session-primitives";
import { SESSION_ACTIONS, SessionActionButton } from "./session-actions";
import { GameArt, PartyAvatars, SessionBadges } from "./session-primitives";
import { capacityPercent } from "./session-helpers";
import { useSessionsStore } from "@/stores/sessions-store";
import { cn } from "@/lib/utils";

interface PartyCardProps {
  sessionId: string;
  index?: number;
}

/**
 * Party Finder card — a lobby-style session with open seats. Shows
 * capacity fill, the party code (copy is a placeholder), and a link to
 * the session detail. Memoized.
 */
export const PartyCard = memo(function PartyCard({ sessionId, index = 0 }: PartyCardProps) {
  const openSession = useSessionsStore((s) => s.openSession);
  const session = sessionById(sessionId);
  if (!session) return null;

  const game = gameForSession(session);
  const members = memberList(session);
  const openSeats = session.capacity - session.size;
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
        aria-label={`Open ${session.title} party`}
      >
        <GameArt game={game} className="aspect-[16/6] w-full" />
        <div className="p-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold">{session.title}</h3>
            <span
              className={cn(
                "shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold",
                openSeats > 0 ? "bg-emerald-500/15 text-emerald-500" : "bg-white/5 text-muted-foreground",
              )}
            >
              {openSeats > 0 ? `${openSeats} seat${openSeats === 1 ? "" : "s"} open` : "Full"}
            </span>
          </div>

          <SessionBadges className="mt-2" session={session} />

          {/* Capacity fill */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${fill}%` }} />
            </div>
            <span className="text-[11px] text-muted-foreground">
              {session.size}/{session.capacity}
            </span>
          </div>

          {/* Party code + actions */}
          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-[11px] font-mono text-muted-foreground" title="Party code">
              {session.partyCode}
              <Copy className="size-3 cursor-pointer text-muted-foreground/60 hover:text-foreground" />
            </span>
            <div className="flex items-center gap-1">
              <PartyAvatars members={members} size={session.size} capacity={session.capacity} />
              {SESSION_ACTIONS.filter((a) => a.id === "invite" || a.id === "spectate").map((action) => (
                <SessionActionButton key={action.id} action={action} size="sm" />
              ))}
              <span className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
                <ArrowRight className="size-4" />
              </span>
            </div>
          </div>
        </div>
      </button>
    </motion.li>
  );
});
