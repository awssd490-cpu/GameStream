import { memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Gamepad2 } from "lucide-react";

import { groupSections, type SectionDef } from "./section-registry";
import { hubs } from "@/features/hubs/hubs-data";
import { Tooltip } from "@/components/shared/tooltip";
import { useShellStore } from "@/stores/shell-store";
import { cn } from "@/lib/utils";

/**
 * The narrow icon column on the far left — GameStream's social-first
 * hub. The rail is the primary identity of the app: logo on top, then
 * the social trio (Home, Friends, DMs), individual Gaming Hubs, gaming
 * content, and Settings pinned to the bottom.
 *
 * A shared `layoutId` pill slides between icons so the active state
 * animates natively. Individual items are memoized — only the active
 * one re-renders on navigation.
 */

function RailItem({
  section,
  active,
  children,
}: {
  section: SectionDef;
  active: boolean;
  children?: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const Icon = section.icon;

  return (
    <Tooltip content={section.label} side="right">
      <NavLink
        to={section.links[0]?.to ?? section.match}
        aria-label={section.label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex size-11 items-center justify-center rounded-2xl",
          "transition-colors duration-150",
          active
            ? "bg-blurple text-blurple-foreground"
            : "bg-guild text-muted-foreground hover:bg-blurple/90 hover:text-blurple-foreground",
        )}
      >
        {active && (
          <motion.span
            layoutId="rail-active-pill"
            transition={
              reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }
            }
            className="absolute inset-0 rounded-2xl bg-blurple"
          />
        )}
        <Icon className="relative size-5" strokeWidth={1.75} />
        {/* Left accent bar on hover (Discord-style affordance) */}
        <span
          className="absolute left-[-8px] top-1/2 h-0 w-[4px] -translate-y-1/2 rounded-r-full bg-white transition-all duration-150 group-hover:h-5"
          aria-hidden
        />
        {children}
      </NavLink>
    </Tooltip>
  );
}

const MemoRailItem = memo(RailItem);

function RailDivider() {
  return <div className="my-1 h-px w-8 bg-border" aria-hidden />;
}

export function ServerRail() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const grouped = groupSections();

  const hubsExpanded = useShellStore((s) => s.hubsExpanded);
  const toggleHubs = useShellStore((s) => s.toggleHubs);
  const inHubs = location.pathname.startsWith("/hubs");
  const activeHubId = location.pathname.split("/")[2];

  const isActive = (match: string) => location.pathname.startsWith(match);

  return (
    <nav
      className="flex w-16 shrink-0 flex-col items-center border-r border-border bg-surface-1 py-3"
      aria-label="Primary navigation"
    >
      {/* Brand */}
      <div
        className="drag-region mb-1 flex size-11 items-center justify-center rounded-2xl bg-blurple text-blurple-foreground shadow-lg"
        title="GameStream"
      >
        <Gamepad2 className="size-6" strokeWidth={2} />
      </div>

      <RailDivider />

      {/* Social trio: Home / Friends / DMs */}
      <div className="flex flex-col items-center gap-1.5">
        {grouped.social.map((section) => (
          <MemoRailItem key={section.id} section={section} active={isActive(section.match)} />
        ))}
      </div>

      <RailDivider />

      {/* Gaming Hubs: collapsible icon stack */}
      <Tooltip content={hubsExpanded ? "Collapse Hubs" : "Expand Hubs"} side="right">
        <button
          onClick={toggleHubs}
          aria-expanded={hubsExpanded}
          aria-label={hubsExpanded ? "Collapse Hubs" : "Expand Hubs"}
          className={cn(
            "relative flex size-11 items-center justify-center rounded-2xl transition-colors duration-150",
            inHubs
              ? "bg-blurple text-blurple-foreground"
              : "bg-guild text-muted-foreground hover:bg-blurple/90 hover:text-blurple-foreground",
          )}
        >
          {inHubs && (
            <motion.span
              layoutId="rail-active-pill"
              transition={
                reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }
              }
              className="absolute inset-0 rounded-2xl bg-blurple"
            />
          )}
          <Gamepad2 className="relative size-5" strokeWidth={1.75} />
        </button>
      </Tooltip>

      <motion.div
        initial={false}
        animate={{ height: hubsExpanded ? "auto" : 0, opacity: hubsExpanded ? 1 : 0 }}
        transition={
          reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 30 }
        }
        className="overflow-hidden"
      >
        <div className="flex flex-col items-center gap-1.5 py-1">
          {hubs.map((hub) => {
            const active = activeHubId === hub.id;
            return (
              <Tooltip key={hub.id} content={hub.name} side="right">
                <NavLink
                  to={`/hubs/${hub.id}`}
                  aria-label={hub.name}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex size-9 items-center justify-center rounded-2xl text-xs font-bold transition-colors duration-150",
                    active
                      ? "bg-blurple text-blurple-foreground"
                      : "bg-guild text-muted-foreground hover:bg-blurple/90 hover:text-blurple-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="rail-active-pill"
                      transition={
                        reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }
                      }
                      className="absolute inset-0 rounded-2xl bg-blurple"
                    />
                  )}
                  <span className="relative">{hub.name.slice(0, 1).toUpperCase()}</span>
                  <span className="absolute left-[-8px] top-1/2 h-0 w-[4px] -translate-y-1/2 rounded-r-full bg-white transition-all duration-150 group-hover:h-5" aria-hidden />
                </NavLink>
              </Tooltip>
            );
          })}
        </div>
      </motion.div>

      <RailDivider />

      {/* Gaming content: Streams / Library / Downloads */}
      <div className="flex flex-col items-center gap-1.5">
        {grouped.library.map((section) => (
          <MemoRailItem key={section.id} section={section} active={isActive(section.match)} />
        ))}
      </div>

      {/* Spacer keeps Settings pinned to the bottom */}
      <div className="flex-1" />

      <div className="flex flex-col items-center gap-1.5">
        {grouped.footer.map((section) => (
          <MemoRailItem key={section.id} section={section} active={isActive(section.match)} />
        ))}
      </div>
    </nav>
  );
}
