import { Eye, Radio } from "lucide-react";
import { Link } from "react-router-dom";

import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

interface Stream {
  id: string;
  streamer: string;
  title: string;
  game: string;
  viewers: number;
  tags: string[];
  tint: string;
}

const streams: Stream[] = [
  {
    id: "s1",
    streamer: "Vex",
    title: "Challenger grind — ranked push",
    game: "Starfall Protocol",
    viewers: 1240,
    tags: ["Competitive"],
    tint: "from-amber-500/40 to-amber-700/20",
  },
  {
    id: "s2",
    streamer: "Nyx",
    title: "Time trial world records",
    game: "Neon Drift",
    viewers: 870,
    tags: ["Speedrun"],
    tint: "from-cyan-500/40 to-blue-700/20",
  },
  {
    id: "s3",
    streamer: "Mara",
    title: "Casual heists with the crew",
    game: "Last Bastion",
    viewers: 540,
    tags: ["Co-op"],
    tint: "from-rose-500/40 to-red-700/20",
  },
  {
    id: "s4",
    streamer: "Rex",
    title: "4K exploration — no commentary",
    game: "Frostbound",
    viewers: 210,
    tags: ["4K"],
    tint: "from-violet-500/40 to-purple-700/20",
  },
];

/**
 * Live streams directory. Static grid previews the future streaming
 * milestone — the thumbnails, playhead and chat arrive later. The
 * architecture (streamer + game + viewers) mirrors what presence
 * events will provide.
 */
export function StreamsPage() {
  const totalViewers = streams.reduce((sum, s) => sum + s.viewers, 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Streams"
        description="Watch your friends play live — in your hub, or across the platform."
        actions={
          <span className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
            <span className="size-2 animate-pulse rounded-full bg-red-500" />
            {streams.length} live · {totalViewers.toLocaleString()} watching
          </span>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {streams.map((stream) => (
            <div
              key={stream.id}
              className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-white/15"
            >
              {/* Thumbnail */}
              <div className={cn("relative flex aspect-video items-center justify-center bg-gradient-to-br", stream.tint)}>
                <div className="flex flex-col items-center gap-1 text-white/60">
                  <Radio className="size-8" strokeWidth={1.5} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">Live</span>
                </div>
                {/* Hover overlay (play is a placeholder for the future player) */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-black">
                    <Eye className="size-4" />
                    Watch
                  </span>
                </div>
                {/* Viewers chip */}
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  <Eye className="size-3" />
                  {stream.viewers.toLocaleString()}
                </span>
              </div>

              <div className="p-3">
                <h3 className="truncate text-sm font-semibold">{stream.title}</h3>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {stream.streamer} · {stream.game}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  {stream.tags.map((tag) => (
                    <span key={tag} className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link to="/hubs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Discover streams in Gaming Hubs →
          </Link>
        </div>
      </div>
    </div>
  );
}
