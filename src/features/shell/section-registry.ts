import type { LucideIcon } from "lucide-react";

import {
  Clapperboard,
  Download,
  Gamepad2,
  Home,
  Library,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react";

export type SectionId =
  | "home"
  | "friends"
  | "messages"
  | "hubs"
  | "streams"
  | "library"
  | "downloads"
  | "settings";

/** Rail grouping — controls the vertical order and dividers. */
export type RailGroup = "social" | "hubs" | "library" | "footer";

export interface SectionLink {
  label: string;
  to: string;
}

export interface SectionDef {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  /** Matched against the first path segment to highlight the rail item. */
  match: string;
  description: string;
  group: RailGroup;
  /** Rendered in the secondary sidebar. */
  links: SectionLink[];
}

/**
 * The shell's source of truth. Each feature registers itself here with
 * its icon, rail group and sub-navigation; the rail, sidebar, top bar
 * and command palette all render from this single array.
 *
 * GameStream is communication-first: social features (home, friends,
 * DMs) lead the rail, gaming content (streams, library, downloads)
 * follows, and settings stays pinned to the bottom.
 */
export const sections: SectionDef[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    match: "/home",
    description: "Your feed and quick access",
    group: "social",
    links: [{ label: "Overview", to: "/home" }],
  },
  {
    id: "friends",
    label: "Friends",
    icon: Users,
    match: "/friends",
    description: "Who's online and what they're playing",
    group: "social",
    links: [{ label: "Friends", to: "/friends" }],
  },
  {
    id: "messages",
    label: "Direct Messages",
    icon: MessageCircle,
    match: "/messages",
    description: "One-on-one chats with your crew",
    group: "social",
    links: [{ label: "Messages", to: "/messages" }],
  },
  {
    id: "hubs",
    label: "Gaming Hubs",
    icon: Gamepad2,
    match: "/hubs",
    description: "Communities for your clans, guilds and crews",
    group: "hubs",
    links: [{ label: "Browse Hubs", to: "/hubs" }],
  },
  {
    id: "streams",
    label: "Streams",
    icon: Clapperboard,
    match: "/streams",
    description: "Watch your friends play live",
    group: "library",
    links: [{ label: "Live Now", to: "/streams" }],
  },
  {
    id: "library",
    label: "Game Library",
    icon: Library,
    match: "/library",
    description: "Your collection across every platform",
    group: "library",
    links: [{ label: "All Games", to: "/library" }],
  },
  {
    id: "downloads",
    label: "Downloads",
    icon: Download,
    match: "/downloads",
    description: "Installs, updates and patches",
    group: "library",
    links: [{ label: "Active", to: "/downloads" }],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    match: "/settings",
    description: "Customize GameStream",
    group: "footer",
    links: [{ label: "General", to: "/settings" }],
  },
];

/** Rail order — the order within each group follows this array. */
const groupOrder: RailGroup[] = ["social", "hubs", "library", "footer"];

/** Groups sections for the rail, preserving declaration order within a group. */
export function groupSections(): Record<RailGroup, SectionDef[]> {
  const grouped: Record<RailGroup, SectionDef[]> = {
    social: [],
    hubs: [],
    library: [],
    footer: [],
  };
  for (const section of sections) {
    grouped[section.group].push(section);
  }
  return grouped;
}

export { groupOrder };

/** Resolves the active section from the current pathname. */
export function sectionForPath(pathname: string): SectionDef | undefined {
  return sections.find((section) => pathname.startsWith(section.match));
}
