import type { LucideIcon } from "lucide-react";
import {
  Headphones,
  MonitorPlay,
  Radio,
  Send,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Session actions — UI placeholders only. The voice / streaming /
 * remote-play / invite / spectator milestones wire these handlers. Each
 * action documents what future capability it unlocks.
 */
export type SessionActionId = "voice" | "stream" | "remote" | "invite" | "spectate";

export interface SessionActionDef {
  id: SessionActionId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** When true the action renders disabled with a "soon" tooltip. */
  soon: boolean;
}

export const SESSION_ACTIONS: SessionActionDef[] = [
  {
    id: "voice",
    label: "Voice",
    description: "Join the session's voice room.",
    icon: Headphones,
    soon: true,
  },
  {
    id: "stream",
    label: "Streaming",
    description: "Watch the session stream live.",
    icon: Radio,
    soon: true,
  },
  {
    id: "remote",
    label: "Remote Play",
    description: "Play with the host over Remote Play.",
    icon: MonitorPlay,
    soon: true,
  },
  {
    id: "invite",
    label: "Invite Friends",
    description: "Send a party invite with the session code.",
    icon: Send,
    soon: true,
  },
  {
    id: "spectate",
    label: "Spectate",
    description: "Watch the match as a spectator.",
    icon: Users,
    soon: true,
  },
];

/** Compact icon button used on session/party cards. */
export function SessionActionButton({
  action,
  size = "sm",
}: {
  action: SessionActionDef;
  size?: "sm" | "md";
}) {
  const Icon = action.icon;
  return (
    <button
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
