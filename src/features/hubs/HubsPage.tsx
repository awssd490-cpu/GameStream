import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";

import { hubs } from "./hubs-data";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

/**
 * Gaming Hub browser. Static catalog preview — membership, discovery
 * and analytics arrive with the backend milestones. Each card links to
 * the hub's detail view.
 */
export function HubsPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Gaming Hubs"
        description="Communities built around how you play — clans, guilds, crews and LAN parties."
        actions={
          <button className="flex h-9 items-center gap-2 rounded-lg bg-blurple px-3 text-sm font-semibold text-blurple-foreground transition-colors hover:bg-blurple/90">
            <Plus className="size-4" />
            Create Hub
          </button>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <Link
                key={hub.id}
                to={`/hubs/${hub.id}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-white/15"
              >
                {/* Banner */}
                <div
                  className={cn(
                    "flex aspect-[16/6] items-center justify-center bg-gradient-to-br",
                    hub.tint,
                  )}
                >
                  <Icon className="size-9 text-white/50 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.5} />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold tracking-tight">{hub.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {hub.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      {hub.online} online
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      {hub.members}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
