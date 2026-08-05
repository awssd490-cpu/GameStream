import type { LucideIcon } from "lucide-react";
import {
  Crown,
  Flame,
  Ghost,
  Rocket,
  Swords,
  Trophy,
} from "lucide-react";

/**
 * Game Sessions data — the shape mirrors the future sessions backend.
 * A Game Session is people actively playing together (not a voice
 * channel). Member ids reference the friends feature so the two stay in
 * one id space without duplication.
 */

export type SessionStatus = "live" | "lobby" | "full";
export type Difficulty = "casual" | "intermediate" | "hardcore";
export type Platform = "pc" | "console" | "crossplay";

/** The game being played. Shared by friends, sessions and the detail drawer. */
export interface Game {
  id: string;
  title: string;
  tag: string;
  /** Gradient used for game artwork strips. */
  tint: string;
  icon: LucideIcon;
}

export interface PartyMember {
  id: string;
  name: string;
  initials: string;
  status: "in-session" | "host" | "spectating";
}

export interface GameSession {
  id: string;
  /** Which game is being played. */
  gameId: string;
  /** Session title, e.g. "Ranked grind — need 2". */
  title: string;
  status: SessionStatus;
  difficulty: Difficulty;
  platform: Platform;
  region: string;
  /** Estimated round-trip latency in ms (placeholder — future network probe). */
  latencyMs: number;
  /** Party capacity, e.g. 4. */
  capacity: number;
  /** Current party size. */
  size: number;
  /** In-party member ids, resolved via the friends feature. */
  memberIds: string[];
  /** Host member. */
  hostId: string;
  /** The Gaming Hub this session belongs to (optional). */
  hubId?: string;
  /** Short display code (placeholder — real invites come with backend). */
  partyCode: string;
  startedAt: number;
}

const minutesAgo = (m: number) => Date.now() - m * 60_000;

export const games: Game[] = [
  { id: "starfall", title: "Starfall Protocol", tag: "FPS", tint: "from-indigo-500/60 via-violet-600/40 to-surface-3", icon: Swords },
  { id: "bastion", title: "Last Bastion", tag: "Tower Defense", tint: "from-rose-500/60 via-red-600/40 to-surface-3", icon: Crown },
  { id: "neondrift", title: "Neon Drift", tag: "Racing", tint: "from-cyan-500/60 via-blue-600/40 to-surface-3", icon: Rocket },
  { id: "emberknight", title: "Ember Knight", tag: "RPG", tint: "from-amber-500/60 via-orange-600/40 to-surface-3", icon: Flame },
  { id: "frostbound", title: "Frostbound", tag: "Adventure", tint: "from-sky-500/60 via-indigo-600/40 to-surface-3", icon: Ghost },
  { id: "crimsoncrown", title: "Crimson Crown", tag: "Strategy", tint: "from-emerald-500/60 via-teal-600/40 to-surface-3", icon: Trophy },
];

/** Resolves a game by id. */
export function gameById(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}

const mem: Record<string, PartyMember> = {
  f1: { id: "f1", name: "Aria", initials: "AR", status: "host" },
  f2: { id: "f2", name: "Rex", initials: "RX", status: "in-session" },
  f3: { id: "f3", name: "Nyx", initials: "NY", status: "in-session" },
  f4: { id: "f4", name: "Mara", initials: "MR", status: "in-session" },
  f5: { id: "f5", name: "Kael", initials: "KL", status: "spectating" },
  f6: { id: "f6", name: "Juno", initials: "JN", status: "in-session" },
  f7: { id: "f7", name: "Sage", initials: "SG", status: "spectating" },
  f8: { id: "f8", name: "Ren", initials: "RN", status: "in-session" },
  f9: { id: "f9", name: "Vex", initials: "VX", status: "in-session" },
};

/** Resolves a party member (friend) by id. */
export function memberById(id: string): PartyMember | undefined {
  return mem[id];
}

/** Resolves the display ids of all members in a session. */
export function memberList(session: GameSession): PartyMember[] {
  return session.memberIds.map((id) => memberById(id)).filter((m): m is PartyMember => Boolean(m));
}

/**
 * Static catalog of Game Sessions. UI architecture only — a future
 * sessions service replaces this constant with live data using the same
 * fields. Friends resolve their Current Session / Party Size / Session
 * Status by scanning this catalog for their id.
 */
export const sessions: GameSession[] = [
  {
    id: "s-live-1",
    gameId: "starfall",
    title: "Ranked grind — need two",
    status: "live",
    difficulty: "hardcore",
    platform: "crossplay",
    region: "EU-West",
    latencyMs: 24,
    capacity: 5,
    size: 3,
    memberIds: ["f1", "f4", "f9"],
    hostId: "f1",
    hubId: "elite",
    partyCode: "GS-7K4Q",
    startedAt: minutesAgo(52),
  },
  {
    id: "s-live-2",
    gameId: "bastion",
    title: "Northern gate — wave 24",
    status: "live",
    difficulty: "hardcore",
    platform: "pc",
    region: "US-East",
    latencyMs: 18,
    capacity: 4,
    size: 4,
    memberIds: ["f2", "f6", "f7", "f8"],
    hostId: "f2",
    hubId: "raiders",
    partyCode: "GS-W9PB",
    startedAt: minutesAgo(78),
  },
  {
    id: "s-live-3",
    gameId: "neondrift",
    title: "Time trial records",
    status: "live",
    difficulty: "intermediate",
    platform: "console",
    region: "Asia-Pacific",
    latencyMs: 42,
    capacity: 2,
    size: 2,
    memberIds: ["f3", "f5"],
    hostId: "f3",
    hubId: "drift",
    partyCode: "GS-L2RM",
    startedAt: minutesAgo(36),
  },
  {
    id: "s-lobby-1",
    gameId: "emberknight",
    title: "Ashen Vaults — need a tank",
    status: "lobby",
    difficulty: "intermediate",
    platform: "crossplay",
    region: "EU-West",
    latencyMs: 31,
    capacity: 4,
    size: 2,
    memberIds: ["f1", "f4"],
    hostId: "f1",
    hubId: "forge",
    partyCode: "GS-C3TX",
    startedAt: minutesAgo(9),
  },
  {
    id: "s-lobby-2",
    gameId: "frostbound",
    title: "Exploration — chill vibes",
    status: "lobby",
    difficulty: "casual",
    platform: "pc",
    region: "US-West",
    latencyMs: 27,
    capacity: 3,
    size: 1,
    memberIds: ["f6"],
    hostId: "f6",
    hubId: "void",
    partyCode: "GS-F8NE",
    startedAt: minutesAgo(14),
  },
  {
    id: "s-lobby-3",
    gameId: "crimsoncrown",
    title: "Ranked duo push",
    status: "lobby",
    difficulty: "hardcore",
    platform: "pc",
    region: "EU-West",
    latencyMs: 22,
    capacity: 2,
    size: 1,
    memberIds: ["f9"],
    hostId: "f9",
    hubId: "elite",
    partyCode: "GS-R2KD",
    startedAt: minutesAgo(21),
  },
];

/** Resolves a session by id. */
export function sessionById(id: string): GameSession | undefined {
  return sessions.find((session) => session.id === id);
}

/** True when the given friend id is part of a live session. */
export function activeSessionForFriend(friendId: string): GameSession | undefined {
  return sessions.find((session) => session.status !== "lobby" && session.memberIds.includes(friendId));
}

/** True when the given friend id is part of any session. */
export function sessionForFriend(friendId: string): GameSession | undefined {
  return sessions.find((session) => session.memberIds.includes(friendId));
}
