import type { LucideIcon } from "lucide-react";
import {
  Anchor,
  Coffee,
  Crown,
  Dices,
  Dumbbell,
  Flame,
  Gem,
  Ghost,
  Gamepad2,
  Orbit,
  Rocket,
  Skull,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";

export interface HubChannel {
  id: string;
  name: string;
  type: "text" | "voice";
}

export interface HubEvent {
  id: string;
  title: string;
  date: string;
  attending: number;
}

export interface HubMember {
  id: string;
  name: string;
  status: "online" | "idle" | "offline";
  role: "Owner" | "Mod" | "Member";
  playing?: string;
}

export interface GamingHub {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Deterministic gradient per hub for the banner tile. */
  tint: string;
  members: number;
  online: number;
  channels: HubChannel[];
  events: HubEvent[];
  roster: HubMember[];
}

/**
 * Static catalog of Gaming Hubs. UI architecture only — the real hub
 * store, membership and presence arrive with the backend milestones.
 * Swapping this constant for a service-driven store is a drop-in change.
 */
export const hubs: GamingHub[] = [
  {
    id: "elite",
    name: "The Elites",
    description: "Ranked grind squad. Gold lobbies only.",
    icon: Crown,
    tint: "from-amber-500/50 to-amber-700/30",
    members: 128,
    online: 42,
    channels: [
      { id: "e-general", name: "general", type: "text" },
      { id: "e-lfg", name: "looking-for-group", type: "text" },
      { id: "e-lounge", name: "lounge", type: "voice" },
    ],
    events: [
      { id: "e1", title: "Ranked Night", date: "Fri 8 PM", attending: 18 },
    ],
    roster: [
      { id: "em1", name: "Vex", status: "online", role: "Owner", playing: "Starfall Protocol" },
      { id: "em2", name: "Nyx", status: "online", role: "Mod", playing: "Neon Drift" },
      { id: "em3", name: "Rook", status: "idle", role: "Member" },
    ],
  },
  {
    id: "forge",
    name: "The Forge",
    description: "LAN party crew — pizza, nostalgia and 1v1 grudge matches.",
    icon: Flame,
    tint: "from-orange-500/50 to-red-600/30",
    members: 86,
    online: 21,
    channels: [
      { id: "f-general", name: "general", type: "text" },
      { id: "f-clips", name: "clips", type: "text" },
      { id: "f-main", name: "Main Room", type: "voice" },
    ],
    events: [
      { id: "f1", title: "Summer LAN", date: "Sat 12 PM", attending: 24 },
    ],
    roster: [
      { id: "fm1", name: "Rex", status: "online", role: "Owner", playing: "Crimson Crown" },
      { id: "fm2", name: "Pixel", status: "offline", role: "Member" },
    ],
  },
  {
    id: "void",
    name: "The Void",
    description: "A quieter place. Lurkers welcome.",
    icon: Ghost,
    tint: "from-violet-500/50 to-purple-800/30",
    members: 210,
    online: 58,
    channels: [
      { id: "v-general", name: "general", type: "text" },
      { id: "v-whispers", name: "whispers", type: "voice" },
    ],
    events: [
      { id: "v1", title: "Silent Stream Watch", date: "Sun 9 PM", attending: 31 },
    ],
    roster: [
      { id: "vm1", name: "Hush", status: "online", role: "Owner" },
      { id: "vm2", name: "Echo", status: "idle", role: "Mod", playing: "Frostbound" },
    ],
  },
  {
    id: "raiders",
    name: "Night Raiders",
    description: "Late-night co-op and heist crews.",
    icon: Skull,
    tint: "from-cyan-500/50 to-blue-700/30",
    members: 64,
    online: 17,
    channels: [
      { id: "r-general", name: "general", type: "text" },
      { id: "r-ops", name: "ops-room", type: "voice" },
    ],
    events: [
      { id: "r1", title: "Heist Marathon", date: "Thu 11 PM", attending: 12 },
    ],
    roster: [
      { id: "rm1", name: "Mara", status: "online", role: "Owner", playing: "Last Bastion" },
    ],
  },
];

/**
 * Icon pool for future hubs. Kept separate so adding a hub is a data
 * edit, not an import change.
 */
export const hubIconPool: LucideIcon[] = [
  Gamepad2,
  Anchor,
  Coffee,
  Dices,
  Dumbbell,
  Gem,
  Orbit,
  Rocket,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Zap,
];

/** Resolves a hub by id. */
export function hubById(id: string): GamingHub | undefined {
  return hubs.find((hub) => hub.id === id);
}
