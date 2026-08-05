import { Gauge, Gamepad2, Globe2, MapPin } from "lucide-react";

import { gameById, games, type Game, type GameSession } from "./sessions-data";
import {
  difficultyMeta,
  latencyTier,
  platformLabel,
  sessionStatusLabel,
} from "./session-helpers";
import { cn } from "@/lib/utils";

/** Game artwork banner. Shared by session cards, party cards and the drawer. */
export function GameArt({ game, className }: { game: Game; className?: string }) {
  const Icon = game.icon;
  return (
    <div className={cn("relative flex items-center justify-center bg-gradient-to-br", game.tint, className)}>
      <Icon className="text-white/40 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.25} />
    </div>
  );
}

/** Session status pill — pulsing live dot for live sessions. */
export function SessionStatusPill({ session }: { session: GameSession }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        session.status === "live" ? "bg-red-500/15 text-red-400" : "bg-white/5 text-muted-foreground",
      )}
    >
      <span className={cn("size-1.5 rounded-full", session.status === "live" ? "animate-pulse bg-red-500" : "bg-muted-foreground")} />
      {sessionStatusLabel(session.status)}
    </span>
  );
}

/** Difficulty / platform / region / latency badge row. */
export function SessionBadges({ session, className }: { session: GameSession; className?: string }) {
  const difficulty = difficultyMeta(session.difficulty);
  const latency = latencyTier(session.latencyMs);
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-semibold", difficulty.className)}>
        {difficulty.label}
      </span>
      <span className="flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-muted-foreground">
        <Gamepad2 className="size-3" />
        {platformLabel(session.platform)}
      </span>
      <span className="flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-muted-foreground">
        <MapPin className="size-3" />
        {session.region}
      </span>
      <span className={cn("flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold", latency.className)}>
        <Gauge className="size-3" />
        {latency.label}
      </span>
    </div>
  );
}

/**
 * Overlapping member avatars with a capacity overflow count. Uses the
 * same initials/status language as the friends feature.
 */
export function PartyAvatars({
  members,
  size,
  capacity,
  className,
}: {
  members: { initials: string; status: string }[];
  size: number;
  capacity: number;
  className?: string;
}) {
  const show = members.slice(0, 4);
  const remaining = Math.max(0, capacity - show.length);
  return (
    <div className={cn("flex items-center", className)}>
      {show.map((member, index) => (
        <span
          key={`${member.initials}-${index}`}
          className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-blurple/25 text-[10px] font-semibold text-blurple"
          style={{ marginLeft: index === 0 ? 0 : -8 }}
          title={member.status === "host" ? "Host" : "In party"}
        >
          {member.initials}
        </span>
      ))}
      {remaining > 0 && (
        <span
          className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-white/10 text-[10px] font-semibold text-muted-foreground"
          style={{ marginLeft: -8 }}
          title={`${size}/${capacity} in party`}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
}

/** Region globe icon wrapper (used in the page header summary). */
export function RegionGlyph({ region, className }: { region: string; className?: string }) {
  return (
    <span className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <Globe2 className="size-3.5" />
      {region}
    </span>
  );
}

/**
 * Resolve the game for a session. Every session references a valid game
 * id, so this returns a concrete Game (falling back to the catalog's
 * first entry rather than surfacing undefined throughout the UI).
 */
export function gameForSession(session: GameSession): Game {
  return gameById(session.gameId) ?? games[0];
}
