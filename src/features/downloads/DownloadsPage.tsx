import { CheckCircle2, Download, Pause, Play, RefreshCw, X } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

interface DownloadItem {
  id: string;
  title: string;
  size: string;
  progress: number;
  speed: string;
  state: "downloading" | "paused" | "queued" | "complete";
}

const downloads: DownloadItem[] = [
  { id: "d1", title: "Starfall Protocol", size: "38.4 GB", progress: 62, speed: "84 MB/s", state: "downloading" },
  { id: "d2", title: "Neon Drift", size: "12.1 GB", progress: 24, speed: "51 MB/s", state: "downloading" },
  { id: "d3", title: "Ember Knight — Patch 1.7", size: "2.3 GB", progress: 100, speed: "—", state: "complete" },
  { id: "d4", title: "Crimson Crown", size: "56.8 GB", progress: 0, speed: "—", state: "queued" },
];

const stateLabel: Record<DownloadItem["state"], string> = {
  downloading: "Downloading",
  paused: "Paused",
  queued: "Queued",
  complete: "Installed",
};

/**
 * Download manager. Static progress list previews the downloads
 * milestone — the real queue, throttling and disk plumbing arrive
 * later. Progress bars are purely presentational.
 */
export function DownloadsPage() {
  const active = downloads.filter((d) => d.state === "downloading").length;

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Downloads"
        description="Installs, updates and patches."
        actions={
          <span className="text-sm text-muted-foreground">
            {active} active {active === 1 ? "download" : "downloads"}
          </span>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-2">
          {downloads.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                  <Download className="size-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.state === "downloading" || item.state === "paused" ? (
                      <>
                        {item.progress}% · {item.size} · {item.speed}
                      </>
                    ) : item.state === "complete" ? (
                      <>
                        {item.size} · Ready to play
                      </>
                    ) : (
                      item.size
                    )}
                  </p>
                </div>

                <span
                  className={cn(
                    "hidden shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold sm:flex",
                    item.state === "complete"
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-white/5 text-muted-foreground",
                  )}
                >
                  {item.state === "complete" && <CheckCircle2 className="size-3" />}
                  {stateLabel[item.state]}
                </span>

                {/* Row actions */}
                <div className="flex shrink-0 items-center gap-0.5 text-muted-foreground">
                  {item.state === "downloading" && (
                    <button className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-white/10 hover:text-foreground" aria-label="Pause" title="Pause">
                      <Pause className="size-4" />
                    </button>
                  )}
                  {item.state === "paused" && (
                    <button className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-white/10 hover:text-foreground" aria-label="Resume" title="Resume">
                      <Play className="size-4" />
                    </button>
                  )}
                  {item.state === "queued" && (
                    <button className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-white/10 hover:text-foreground" aria-label="Start now" title="Start now">
                      <RefreshCw className="size-4" />
                    </button>
                  )}
                  {(item.state === "downloading" || item.state === "paused" || item.state === "queued") && (
                    <button className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-white/10 hover:text-foreground" aria-label="Cancel" title="Cancel">
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    item.state === "complete" ? "bg-emerald-500" : "bg-blurple",
                  )}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
