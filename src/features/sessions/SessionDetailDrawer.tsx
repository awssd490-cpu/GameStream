import { AnimatePresence, motion } from "framer-motion";
import {
  Copy,
  Gauge,
  MapPin,
  Shield,
  Timer,
  Users,
  X,
} from "lucide-react";

import { memberList, sessionById } from "./sessions-data";
import { gameForSession } from "./session-primitives";
import { SESSION_ACTIONS } from "./session-actions";
import { GameArt, PartyAvatars, SessionStatusPill } from "./session-primitives";
import { difficultyMeta, latencyTier, platformLabel } from "./session-helpers";
import { hubById } from "@/features/hubs/hubs-data";
import { useSessionsStore } from "@/stores/sessions-store";
import { cn } from "@/lib/utils";

/**
 * Session detail drawer. Slide-over driven by the sessions store. Shows
 * the full party roster, game metadata, estimated latency, and the
 * session actions (voice / streaming / remote play / invite /
 * spectate) as placeholders — the future backend wires these.
 */
export function SessionDetailDrawer() {
  const selectedId = useSessionsStore((s) => s.selectedSessionId);
  const closeSession = useSessionsStore((s) => s.closeSession);
  const session = selectedId ? sessionById(selectedId) : undefined;

  return (
    <AnimatePresence>
      {session && (() => {
        const game = gameForSession(session);
        const members = memberList(session);
        const hub = session.hubId ? hubById(session.hubId) : undefined;
        const difficulty = difficultyMeta(session.difficulty);
        const latency = latencyTier(session.latencyMs);
        const host = members.find((m) => m.id === session.hostId) ?? members[0];

        return (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={closeSession}
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
              aria-label={`${session.title} session`}
              className="fixed right-0 top-0 z-50 flex h-full w-[360px] max-w-[92vw] flex-col border-l border-border bg-surface-3 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold tracking-tight">Game Session</h2>
                <button
                  onClick={closeSession}
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label="Close session"
                  title="Close session"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {/* Art */}
                <div className="relative px-4 pt-4">
                  <GameArt game={game} className="aspect-[16/6] w-full rounded-xl" />
                  <div className="absolute left-6 top-6">
                    <SessionStatusPill session={session} />
                  </div>
                </div>

                {/* Identity */}
                <div className="px-4 pt-4">
                  <h3 className="text-lg font-semibold tracking-tight">{session.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {game.title} · hosted by {host?.name ?? "Host"}
                    {hub ? ` · ${hub.name}` : ""}
                  </p>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-2 px-4 pt-4">
                  <div className="rounded-lg border border-border bg-card p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <Shield className="size-3.5" /> Difficulty
                    </p>
                    <span className={cn("mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-semibold", difficulty.className)}>
                      {difficulty.label}
                    </span>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <Users className="size-3.5" /> Platform
                    </p>
                    <p className="mt-1 text-xs font-medium">{platformLabel(session.platform)}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <MapPin className="size-3.5" /> Region
                    </p>
                    <p className="mt-1 text-xs font-medium">{session.region}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <Gauge className="size-3.5" /> Latency
                    </p>
                    <span className={cn("mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-semibold", latency.className)}>
                      {latency.label}
                    </span>
                  </div>
                </div>

                {/* Party */}
                <div className="px-4 pt-5">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <Timer className="size-3.5" /> Party
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      {session.size}/{session.capacity}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <PartyAvatars members={members} size={session.size} capacity={session.capacity} />
                    <div className="ml-auto flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-[11px] font-mono text-muted-foreground">
                      {session.partyCode}
                      <Copy className="size-3 cursor-pointer text-muted-foreground/60 hover:text-foreground" />
                    </div>
                  </div>
                </div>

                {/* Roster */}
                <div className="px-4 pt-4">
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Roster</p>
                  <ul className="mt-2 space-y-1">
                    {members.map((member) => (
                      <li key={member.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5">
                        <span className="relative flex size-8 items-center justify-center rounded-full bg-blurple/25 text-xs font-semibold text-blurple">
                          {member.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{member.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {member.status === "host" ? "Host" : member.status === "spectating" ? "Spectating" : "In party"}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="px-4 pt-5">
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Join the session
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {SESSION_ACTIONS.map((action) => (
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

                <div className="h-6" />
              </div>
            </motion.aside>
          </>
        );
      })()}
    </AnimatePresence>
  );
}
