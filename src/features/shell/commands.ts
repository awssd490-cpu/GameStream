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

import { hubs } from "@/features/hubs/hubs-data";

export interface PaletteGroup {
  id: string;
  label: string;
  items: PaletteItem[];
}

export interface PaletteItem {
  id: string;
  label: string;
  hint?: string;
  keywords?: string;
  icon: LucideIcon;
  onSelect: () => void;
}

export type ItemSource = {
  group: PaletteGroup;
  item: PaletteItem;
};

/** Swappable navigator — the palette host sets this to react-router navigate. */
let navigateToPath: (to: string) => void = () => {};

export function setPaletteNavigator(fn: (to: string) => void): void {
  navigateToPath = fn;
}

/**
 * Command palette item registry.
 *
 * Future milestones add actions here — Launch game, Join friend,
 * Open voice room, Start stream, Install from library — without touching
 * the palette UI. Actions are derived from the section registry and the
 * hub catalog, so commands can never drift from routes.
 */
export function buildPaletteCommands(): PaletteGroup[] {
  const groups: PaletteGroup[] = [
    {
      id: "navigation",
      label: "Navigation",
      items: [
        {
          id: "nav-home",
          label: "Go to Home",
          hint: "Overview",
          keywords: "feed dashboard start",
          icon: Home,
          onSelect: () => navigateToPath("/home"),
        },
        {
          id: "nav-friends",
          label: "Go to Friends",
          hint: "Who's online",
          keywords: "people social",
          icon: Users,
          onSelect: () => navigateToPath("/friends"),
        },
        {
          id: "nav-messages",
          label: "Go to Direct Messages",
          hint: "Chats",
          keywords: "dm chat inbox",
          icon: MessageCircle,
          onSelect: () => navigateToPath("/messages"),
        },
        {
          id: "nav-hubs",
          label: "Browse Gaming Hubs",
          hint: "Communities",
          keywords: "clan guild group server",
          icon: Gamepad2,
          onSelect: () => navigateToPath("/hubs"),
        },
        {
          id: "nav-streams",
          label: "Go to Streams",
          hint: "Live now",
          keywords: "watch live broadcast",
          icon: Clapperboard,
          onSelect: () => navigateToPath("/streams"),
        },
        {
          id: "nav-library",
          label: "Open Game Library",
          hint: "Your games",
          keywords: "games collection",
          icon: Library,
          onSelect: () => navigateToPath("/library"),
        },
        {
          id: "nav-downloads",
          label: "Go to Downloads",
          hint: "Installs & updates",
          keywords: "install update patch",
          icon: Download,
          onSelect: () => navigateToPath("/downloads"),
        },
        {
          id: "nav-settings",
          label: "Open Settings",
          hint: "Preferences",
          keywords: "prefs options config",
          icon: Settings,
          onSelect: () => navigateToPath("/settings"),
        },
      ],
    },
  ];

  if (hubs.length > 0) {
    groups.push({
      id: "hubs",
      label: "Gaming Hubs",
      items: hubs.map((hub) => ({
        id: `hub-${hub.id}`,
        label: `Open ${hub.name}`,
        hint: `${hub.online} online`,
        keywords: hub.description,
        icon: hub.icon,
        onSelect: () => navigateToPath(`/hubs/${hub.id}`),
      })),
    });
  }

  return groups;
}

/**
 * Matching is order-agnostic word containment, so "library games" and
 * "games library" both match. Cheaper than fuzzy scoring and predictable.
 */
export function matchCommands(
  groups: PaletteGroup[],
  query: string,
): ItemSource[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return groups.flatMap((group) => group.items.map((item) => ({ group, item })));
  }
  const terms = q.split(/\s+/);
  const results: ItemSource[] = [];
  for (const group of groups) {
    for (const item of group.items) {
      const haystack = `${item.label} ${item.hint ?? ""} ${item.keywords ?? ""}`.toLowerCase();
      if (terms.every((term) => haystack.includes(term))) {
        results.push({ group, item });
      }
    }
  }
  return results;
}
