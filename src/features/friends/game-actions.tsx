import type { LucideIcon } from "lucide-react";
import {
  Headphones,
  MonitorPlay,
  PhoneCall,
  Radio,
  Swords,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The five gaming actions every friend surfaces. UI placeholders only —
 * the handlers are wired by the voice/streaming/remote-play/sessions
 * milestones. Each action documents what future capability it unlocks.
 */
export type GameActionId = "join" | "watch" | "remote" | "voice" | "party";

export interface GameActionDef {
  id: GameActionId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** When true the action is shown disabled with a "soon" tooltip. */
  soon: boolean;
}

export const GAME_ACTIONS: GameActionDef[] = [
  {
    id: "join",
    label: "Join Game",
    description: "Launch the same game and drop into their session.",
    icon: Swords,
    soon: false,
  },
  {
    id: "watch",
    label: "Watch Stream",
    description: "View their live stream in GameStream.",
    icon: Radio,
    soon: true,
  },
  {
    id: "remote",
    label: "Remote Play",
    description: "Play their game together over Remote Play.",
    icon: MonitorPlay,
    soon: true,
  },
  {
    id: "voice",
    label: "Voice",
    description: "Hop into a voice room with them.",
    icon: Headphones,
    soon: true,
  },
  {
    id: "party",
    label: "Invite to Party",
    description: "Add them to your game party.",
    icon: PhoneCall,
    soon: false,
  },
];

/** Icon for a game action id. */
export function gameActionIcon(id: GameActionId): LucideIcon {
  return GAME_ACTIONS.find((a) => a.id === id)?.icon ?? Swords;
}

/** Compact icon-only button; full row used in the profile drawer. */
export function GameActionButton({
  action,
  onClick,
  size = "md",
}: {
  action: GameActionDef;
  onClick?: () => void;
  size?: "sm" | "md";
}) {
  const Icon = action.icon;
  return (
    <button
      onClick={onClick}
      disabled={action.soon}
      title={action.soon ? `${action.label} — coming with a later milestone` : action.description}
      aria-label={action.label}
      className={cn(
        "flex items-center justify-center rounded-lg transition-colors",
        size === "sm" ? "size-8" : "size-9",
        action.soon
          ? "cursor-not-allowed bg-white/5 text-muted-foreground/50"
          : "bg-white/5 text-muted-foreground hover:bg-blurple hover:text-blurple-foreground",
      )}
    >
      <Icon className="size-4" strokeWidth={1.75} />
    </button>
  );
}
