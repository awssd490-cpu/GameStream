import type { Difficulty, Platform, SessionStatus } from "./sessions-data";

/** Display label + accent color for a difficulty tier. */
export function difficultyMeta(difficulty: Difficulty): { label: string; className: string } {
  switch (difficulty) {
    case "casual":
      return { label: "Casual", className: "bg-emerald-500/15 text-emerald-500" };
    case "intermediate":
      return { label: "Intermediate", className: "bg-amber-500/15 text-amber-500" };
    case "hardcore":
      return { label: "Hardcore", className: "bg-red-500/15 text-red-400" };
  }
}

/** Display label for a platform. */
export function platformLabel(platform: Platform): string {
  switch (platform) {
    case "pc":
      return "PC";
    case "console":
      return "Console";
    case "crossplay":
      return "Cross-play";
  }
}

/** Display label for a session status. */
export function sessionStatusLabel(status: SessionStatus): string {
  switch (status) {
    case "live":
      return "Live";
    case "lobby":
      return "Lobby";
    case "full":
      return "Full";
  }
}

/**
 * Estimated-latency tier from a millisecond value. Placeholder — a real
 * network probe (via the future sessions/network service) will drive it.
 */
export function latencyTier(latencyMs: number): { label: string; className: string } {
  if (latencyMs <= 25) return { label: `~${latencyMs}ms`, className: "bg-emerald-500/15 text-emerald-500" };
  if (latencyMs <= 60) return { label: `~${latencyMs}ms`, className: "bg-amber-500/15 text-amber-500" };
  return { label: `~${latencyMs}ms`, className: "bg-red-500/15 text-red-400" };
}

/** Percentage fill (0–100) for party capacity. */
export function capacityPercent(size: number, capacity: number): number {
  if (capacity <= 0) return 0;
  return Math.min(100, Math.round((size / capacity) * 100));
}
