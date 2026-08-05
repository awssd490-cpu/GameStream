import {
  Gamepad2,
  Users,
  MessageCircle,
  Play,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

const featured = [
  { title: "Starfall Protocol", players: "42,118", tag: "FPS" },
  { title: "Ember Knight", players: "18,092", tag: "RPG" },
  { title: "Neon Drift", players: "9,447", tag: "Racing" },
];

const activity = [
  { game: "Starfall Protocol", detail: "In a ranked match · 1h 12m", icon: Play },
  { game: "Ember Knight", detail: "Exploring the Ashen Vaults · 2h 40m", icon: Star },
  { game: "Neon Drift", detail: "Time trial leaderboard · 24m", icon: TrendingUp },
];

const online = [
  { name: "Aria", status: "In game · Starfall Protocol", initials: "AR" },
  { name: "Kael", status: "Online", initials: "KA" },
  { name: "Mira", status: "Online", initials: "MI" },
  { name: "Juno", status: "Idle", initials: "JU" },
];

/**
 * Home dashboard. Composed of stat chips, a featured-games row, and a
 * friends rail — all static previews that real data features will feed
 * in later milestones.
 */
export function HomePage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Good evening, Player One"
        description="Here's what's happening in your world today."
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        {/* Stat chips */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Games Owned", value: "24", icon: Gamepad2 },
            { label: "Friends Online", value: "12", icon: Users },
            { label: "Unread Messages", value: "7", icon: MessageCircle },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Featured games */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Featured</h2>
            <Link to="/library" className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {featured.map((game) => (
              <div
                key={game.title}
                className="group relative overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-blurple/40 via-surface-4 to-surface-3">
                  <Gamepad2 className="size-10 text-white/40" strokeWidth={1.5} />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{game.title}</h3>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {game.tag}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {game.players} playing now
                  </p>
                </div>
                <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-black">
                    <Play className="size-4 fill-black" /> Play
                  </span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {/* Recently played */}
          <section className="col-span-2 rounded-xl border border-border bg-card p-4">
            <h2 className="text-lg font-semibold tracking-tight">Recently played</h2>
            <ul className="mt-3 space-y-2">
              {activity.map((item) => (
                <li
                  key={item.game}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/5"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                    <item.icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.game}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Online friends */}
          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-lg font-semibold tracking-tight">Friends</h2>
            <ul className="mt-3 space-y-2">
              {online.map((friend) => (
                <li
                  key={friend.name}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
                >
                  <span className="relative flex size-8 items-center justify-center rounded-full bg-blurple/25 text-xs font-semibold text-blurple">
                    {friend.initials}
                    <span
                      className={cn(
                        "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-card",
                        friend.status === "Online" || friend.status.startsWith("In game")
                          ? "bg-emerald-500"
                          : "bg-muted-foreground",
                      )}
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{friend.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {friend.status}
                    </p>
                  </div>
                  <Clock className="ml-auto size-3.5 text-muted-foreground/60" />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
