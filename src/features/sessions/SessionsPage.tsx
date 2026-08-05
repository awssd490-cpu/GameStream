import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, Gamepad2, Search, SlidersHorizontal, X } from "lucide-react";

import { sessions as allSessions, type Difficulty, type GameSession } from "./sessions-data";
import { SessionCard } from "./SessionCard";
import { PartyCard } from "./PartyCard";
import { SessionGridSkeleton } from "./SessionSkeleton";
import { SessionDetailDrawer } from "./SessionDetailDrawer";
import { difficultyMeta } from "./session-helpers";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

type Tab = "live" | "party-finder";
type SortKey = "players" | "latency" | "recent";

const DIFFICULTIES: Difficulty[] = ["casual", "intermediate", "hardcore"];

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "players", label: "Most players" },
  { id: "latency", label: "Best latency" },
  { id: "recent", label: "Recently started" },
];

function sortSessions(list: GameSession[], sort: SortKey): GameSession[] {
  const copy = [...list];
  switch (sort) {
    case "players":
      return copy.sort((a, b) => b.size - a.size);
    case "latency":
      return copy.sort((a, b) => a.latencyMs - b.latencyMs);
    case "recent":
      return copy.sort((a, b) => b.startedAt - a.startedAt);
  }
}

/**
 * Game Sessions — the heart of GameStream. Two tabs: Live Now (active
 * sessions) and Party Finder (lobby sessions with open seats). Search,
 * difficulty filter, region filter and sort compose against the mock
 * catalog. A short simulated fetch drives the loading skeletons,
 * demonstrating the async seam the sessions service will fill.
 *
 * Voice / Streaming / Remote Play / Invite / Spectate are UI
 * placeholders only — wired by later milestones.
 */
export function SessionsPage() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("live");
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [sort, setSort] = useState<SortKey>("players");

  // Simulated async load — skeletons first, then the list.
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const live = useMemo(
    () => allSessions.filter((s) => s.status !== "lobby"),
    [],
  );
  const finder = useMemo(
    () => allSessions.filter((s) => s.status === "lobby" && s.size < s.capacity),
    [],
  );

  const visible = useMemo(() => {
    const source = tab === "live" ? live : finder;
    const q = query.trim().toLowerCase();
    return sortSessions(
      source.filter((s) => {
        const matchesQuery = q === "" || s.title.toLowerCase().includes(q);
        const matchesDifficulty = difficulty === "all" || s.difficulty === difficulty;
        return matchesQuery && matchesDifficulty;
      }),
      sort,
    );
  }, [tab, live, finder, query, difficulty, sort]);

  const liveCount = live.length;
  const finderCount = finder.length;
  const regions = useMemo(() => [...new Set(allSessions.map((s) => s.region))].sort(), []);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Game Sessions"
        description="People actively playing together right now — join a party or start your own."
        actions={
          <span className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
            <span className="size-2 animate-pulse rounded-full bg-red-500" />
            {liveCount} live · {finderCount} parties
          </span>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 pb-3">
        {(
          [
            { id: "live", label: "Live Now" },
            { id: "party-finder", label: "Party Finder" },
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-white/10 text-foreground"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-2 px-6 pb-4">
        <div className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg bg-black/30 px-2.5 text-muted-foreground transition-colors focus-within:bg-black/40 focus-within:text-foreground">
          <Search className="size-4 shrink-0" />
          <input
            className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder={tab === "live" ? "Search live sessions" : "Search parties"}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-1">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          {(["all", ...DIFFICULTIES] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={cn(
                "rounded-md px-2 py-1 text-sm font-medium transition-colors",
                difficulty === d
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              {d === "all" ? "All" : difficultyMeta(d).label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-1.5">
          <ArrowUpDown className="size-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => setSort(e.currentTarget.value as SortKey)}
            className="h-8 rounded-md border border-border bg-surface-3 px-2 text-sm text-foreground outline-none transition-colors hover:bg-white/5"
            aria-label="Sort sessions"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Region summary */}
      <div className="flex flex-wrap items-center gap-1.5 px-6 pb-4">
        {regions.map((region) => (
          <span key={region} className="rounded-md bg-white/5 px-2 py-1 text-xs text-muted-foreground">
            {region}
          </span>
        ))}
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <SessionGridSkeleton />
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl border border-border bg-surface-3 text-muted-foreground">
              <Gamepad2 className="size-7" strokeWidth={1.5} />
            </span>
            <h3 className="text-lg font-semibold tracking-tight">
              {tab === "live" ? "No live sessions match" : "No parties match"}
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {tab === "live"
                ? "Try clearing your filters, or start a session and invite your crew."
                : "Try clearing your filters, or create a party and share your code."}
            </p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            {tab === "live" ? (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((session, index) => (
                  <SessionCard key={session.id} sessionId={session.id} index={index} />
                ))}
              </ul>
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((session, index) => (
                  <PartyCard key={session.id} sessionId={session.id} index={index} />
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </div>

      {/* Session detail drawer (mounted only while open) */}
      <SessionDetailDrawer />
    </div>
  );
}
