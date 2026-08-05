import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Hash,
  Lock,
  Megaphone,
  Plus,
  Radio,
  Users,
  Volume2,
} from "lucide-react";

import { hubById, type HubChannel } from "./hubs-data";
import { PlaceholderState } from "@/components/shared/PlaceholderState";
import { cn } from "@/lib/utils";

function ChannelRow({ channel, active }: { channel: HubChannel; active?: boolean }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors",
        active
          ? "bg-white/10 text-foreground"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
      )}
    >
      {channel.type === "text" ? (
        <Hash className="size-4 shrink-0" />
      ) : (
        <Volume2 className="size-4 shrink-0" />
      )}
      <span className="truncate">{channel.name}</span>
    </button>
  );
}

/**
 * A Gaming Hub's interior. Architecture preview: the layout is the
 * channel/voice/member/event surface that future backend milestones
 * fill with real rooms, presence and streams. All content is static.
 */
export function HubDetailPage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId ?? "");

  if (!hub) {
    return (
      <PlaceholderState
        icon={Hash}
        title="Hub not found"
        description="This Gaming Hub doesn't exist or was removed."
      />
    );
  }

  const Icon = hub.icon;

  return (
    <div className="flex h-full">
      {/* Left: hub channel list */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface-2">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
          <span className="truncate text-[15px] font-semibold tracking-tight">{hub.name}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-2" aria-label={`${hub.name} channels`}>
          {/* Announcements */}
          <div>
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Announcements
            </p>
            <button className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
              <Megaphone className="size-4 shrink-0" />
              <span className="truncate">hub-news</span>
            </button>
          </div>

          {/* Text channels */}
          <div>
            <p className="flex items-center gap-1 px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Text
              <Plus className="ml-auto size-3" />
            </p>
            {hub.channels
              .filter((c) => c.type === "text")
              .map((channel) => (
                <ChannelRow key={channel.id} channel={channel} active />
              ))}
          </div>

          {/* Voice rooms */}
          <div>
            <p className="flex items-center gap-1 px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Voice
              <Plus className="ml-auto size-3" />
            </p>
            {hub.channels
              .filter((c) => c.type === "voice")
              .map((channel) => (
                <ChannelRow key={channel.id} channel={channel} />
              ))}
          </div>
        </nav>
      </aside>

      {/* Right: content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Hub header */}
        <div className="flex items-center gap-4 border-b border-border bg-card px-6 py-4">
          <div className={cn("flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br", hub.tint)}>
            <Icon className="size-7 text-white/60" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">{hub.name}</h1>
            <p className="truncate text-sm text-muted-foreground">{hub.description}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
              <Users className="size-3.5" />
              {hub.members}
            </span>
            <button className="flex h-8 items-center gap-2 rounded-lg bg-blurple px-3 text-sm font-semibold text-blurple-foreground transition-colors hover:bg-blurple/90">
              <Lock className="size-3.5" />
              Joined
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {/* Upcoming events */}
          <section>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <CalendarDays className="size-4" />
              Upcoming Events
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {hub.events.length > 0 ? (
                hub.events.map((event) => (
                  <div key={event.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{event.title}</h3>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{event.date}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{event.attending} attending</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No events scheduled yet.</p>
              )}
            </div>
          </section>

          {/* Voice rooms preview */}
          <section className="mt-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Radio className="size-4" />
              Voice Rooms
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {hub.channels.filter((c) => c.type === "voice").length > 0 ? (
                hub.channels
                  .filter((c) => c.type === "voice")
                  .map((channel) => (
                    <div key={channel.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center gap-2">
                        <Volume2 className="size-4 text-emerald-500" />
                        <span className="font-medium">{channel.name}</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">Voice channels arrive with the voice milestone.</p>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">No voice rooms yet.</p>
              )}
            </div>
          </section>

          {/* Roster preview */}
          <section className="mt-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Users className="size-4" />
              Members
            </h2>
            <ul className="mt-3 space-y-1">
              {hub.roster.map((member) => (
                <li key={member.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5">
                  <span className="relative flex size-8 items-center justify-center rounded-full bg-blurple/25 text-xs font-semibold text-blurple">
                    {member.name.slice(0, 1).toUpperCase()}
                    <span
                      className={cn(
                        "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-card",
                        member.status === "online"
                          ? "bg-emerald-500"
                          : member.status === "idle"
                            ? "bg-amber-500"
                            : "bg-muted-foreground",
                      )}
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{member.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.playing ? `Playing ${member.playing}` : member.role}
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">{member.role}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-8 flex justify-center">
            <Link to="/hubs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              ← Back to all hubs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
