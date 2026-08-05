import type { LucideIcon } from "lucide-react";
import {
  Crown,
  Flame,
  Ghost,
  Rocket,
  Skull,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";

/**
 * Friend presence data — the shape deliberately mirrors
 * `services/presence/presence-service.ts` (PresenceStatus + RichPresence),
 * extended with gaming metadata. When the backend milestone wires
 * presenceService.onEvent(...), the UI consumes the same fields.
 */

export type FriendStatus = "in-game" | "online" | "idle" | "offline";

export interface RichPresence {
  /** The game currently running. */
  game: string;
  /** Current activity line inside the game. */
  detail: string;
  /** When the game session started (ms epoch). */
  startedAt: number;
  /** Visual accent for the game art strip. */
  tint: string;
  /** Discord-style party size, e.g. 3/5. */
  party?: string;
}

export interface FriendHub {
  id: string;
  name: string;
  icon: LucideIcon;
}

export interface Friend {
  id: string;
  name: string;
  initials: string;
  status: FriendStatus;
  /** Last online timestamp, used for "last seen" copy when offline. */
  lastSeenAt: number;
  /** Which platform they're playing on. */
  platform?: "pc" | "console" | "mobile";
  /** True when the friend is open to being invited to a party. */
  partyReady?: boolean;
  /** Gaming Hubs the friend belongs to. */
  hubs: FriendHub[];
  presence?: RichPresence;
  /** Mutual friends count (future networking). */
  mutualFriends: number;
  /** Where the friend is, for rich presence. */
  location?: string;
}

const minutesAgo = (m: number) => Date.now() - m * 60_000;

const hubsById: Record<string, FriendHub> = {
  elite: { id: "elite", name: "The Elites", icon: Crown },
  forge: { id: "forge", name: "The Forge", icon: Flame },
  void: { id: "void", name: "The Void", icon: Ghost },
  raiders: { id: "raiders", name: "Night Raiders", icon: Skull },
  ignite: { id: "ignite", name: "Ignite", icon: Sparkles },
  iron: { id: "iron", name: "Iron Legion", icon: Swords },
  drift: { id: "drift", name: "Drift Kings", icon: Rocket },
  kings: { id: "kings", name: "Crown Holders", icon: Trophy },
};

const hub = (...ids: string[]) => ids.map((id) => hubsById[id]);

/**
 * Static catalog of friends. All rich-presence fields are presentational
 * and will be replaced by presence events in a later milestone. The mock
 * timestamps are computed once at module load; elapsed-time labels use
 * them as a stable baseline.
 */
export const friends: Friend[] = [
  {
    id: "f1",
    name: "Aria",
    initials: "AR",
    status: "in-game",
    lastSeenAt: minutesAgo(2),
    platform: "pc",
    partyReady: true,
    hubs: hub("elite", "ignite"),
    presence: {
      game: "Starfall Protocol",
      detail: "In a ranked match — top 8 alive",
      startedAt: minutesAgo(52),
      tint: "from-indigo-500/60 via-violet-600/40 to-surface-3",
      party: "3/5",
    },
    mutualFriends: 8,
    location: "Europe",
  },
  {
    id: "f2",
    name: "Rex",
    initials: "RX",
    status: "in-game",
    lastSeenAt: minutesAgo(5),
    platform: "pc",
    partyReady: true,
    hubs: hub("forge", "raiders"),
    presence: {
      game: "Last Bastion",
      detail: "Defending the northern gate — wave 24",
      startedAt: minutesAgo(78),
      tint: "from-rose-500/60 via-red-600/40 to-surface-3",
      party: "4/4",
    },
    mutualFriends: 12,
    location: "North America",
  },
  {
    id: "f3",
    name: "Nyx",
    initials: "NY",
    status: "in-game",
    lastSeenAt: minutesAgo(8),
    platform: "console",
    hubs: hub("elite", "drift"),
    presence: {
      game: "Neon Drift",
      detail: "Hunting a time-trial world record",
      startedAt: minutesAgo(36),
      tint: "from-cyan-500/60 via-blue-600/40 to-surface-3",
      party: "2/2",
    },
    mutualFriends: 5,
    location: "Asia-Pacific",
  },
  {
    id: "f4",
    name: "Mara",
    initials: "MR",
    status: "online",
    lastSeenAt: minutesAgo(14),
    platform: "pc",
    partyReady: true,
    hubs: hub("raiders", "iron"),
    presence: {
      game: "Crimson Crown",
      detail: "Browsing the armory",
      startedAt: minutesAgo(21),
      tint: "from-emerald-500/60 via-teal-600/40 to-surface-3",
    },
    mutualFriends: 9,
    location: "Europe",
  },
  {
    id: "f5",
    name: "Kael",
    initials: "KL",
    status: "online",
    lastSeenAt: minutesAgo(30),
    platform: "mobile",
    hubs: hub("forge", "kings"),
    presence: {
      game: "Ember Knight",
      detail: "Chatting in the hub lobby",
      startedAt: minutesAgo(42),
      tint: "from-amber-500/60 via-orange-600/40 to-surface-3",
    },
    mutualFriends: 3,
    location: "North America",
  },
  {
    id: "f6",
    name: "Juno",
    initials: "JN",
    status: "idle",
    lastSeenAt: minutesAgo(24),
    platform: "pc",
    hubs: hub("void"),
    presence: {
      game: "Frostbound",
      detail: "Away — 12 minutes",
      startedAt: minutesAgo(120),
      tint: "from-sky-500/60 via-indigo-600/40 to-surface-3",
    },
    mutualFriends: 6,
    location: "Europe",
  },
  {
    id: "f7",
    name: "Sage",
    initials: "SG",
    status: "offline",
    lastSeenAt: minutesAgo(2 * 60),
    platform: "pc",
    hubs: hub("iron", "kings"),
    mutualFriends: 4,
    location: "Asia-Pacific",
  },
  {
    id: "f8",
    name: "Ren",
    initials: "RN",
    status: "offline",
    lastSeenAt: minutesAgo(26 * 60),
    platform: "console",
    hubs: hub("drift"),
    mutualFriends: 2,
    location: "North America",
  },
  {
    id: "f9",
    name: "Vex",
    initials: "VX",
    status: "offline",
    lastSeenAt: minutesAgo(3 * 24 * 60),
    platform: "pc",
    hubs: hub("elite", "void"),
    mutualFriends: 11,
    location: "Europe",
  },
];

/** Resolves a friend by id. */
export function friendById(id: string): Friend | undefined {
  return friends.find((friend) => friend.id === id);
}
