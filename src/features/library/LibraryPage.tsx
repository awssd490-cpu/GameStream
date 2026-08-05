import { useState } from "react";
import { Search, Filter, Gamepad2, Play } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

const games = [
  { title: "Starfall Protocol", tag: "FPS", status: "Installed" },
  { title: "Ember Knight", tag: "RPG", status: "Installed" },
  { title: "Neon Drift", tag: "Racing", status: "Updating" },
  { title: "Crimson Crown", tag: "Strategy", status: "Not installed" },
  { title: "Frostbound", tag: "Adventure", status: "Installed" },
  { title: "Aether Drift", tag: "Racing", status: "Not installed" },
  { title: "Last Bastion", tag: "Tower Defense", status: "Installed" },
  { title: "Pulse Runner", tag: "Platformer", status: "Updating" },
];

const FILTERS = ["All", "Installed", "Updating", "Not installed"] as const;
type Filter = (typeof FILTERS)[number];

/**
 * Game library with client-side filtering and search. Static catalog
 * previews the future library/launcher data layer.
 */
export function LibraryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const visible = games.filter((game) => {
    const matchesQuery = game.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || game.status === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Game Library"
        description="Your collection of games across all platforms."
      />

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 pb-4">
        <div className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg bg-black/30 px-2.5 text-muted-foreground transition-colors focus-within:bg-black/40 focus-within:text-foreground">
          <Search className="size-4 shrink-0" />
          <input
            className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Search your library"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
        </div>
        <button className="flex h-9 items-center gap-2 rounded-lg border border-input px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
          <Filter className="size-4" />
          Filters
        </button>
        <div className="ml-auto flex items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                filter === f
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((game) => (
            <div
              key={game.title}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-white/15"
            >
              <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-surface-4 via-surface-3 to-black/30">
                <Gamepad2 className="size-9 text-white/30" strokeWidth={1.5} />
              </div>
              <div className="flex items-center justify-between p-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{game.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{game.tag}</p>
                </div>
                <button
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-foreground transition-colors hover:bg-blurple hover:text-blurple-foreground"
                  aria-label={`Play ${game.title}`}
                  title={
                    game.status === "Not installed" ? "Not installed" : `Play ${game.title}`
                  }
                >
                  <Play className="size-4" fill={game.status === "Not installed" ? "none" : "currentColor"} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {visible.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No games match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
