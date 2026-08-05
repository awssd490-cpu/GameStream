import { NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";

import { sectionForPath } from "./section-registry";
import { useShellStore } from "@/stores/shell-store";
import { cn } from "@/lib/utils";

/**
 * The contextual sidebar between the rail and the content area. Shows
 * the active section's sub-navigation, a persistent header for the
 * section, and a mock user panel at the bottom (account, status,
 * settings). Hidden when the user collapses it.
 */
export function SecondarySidebar() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const collapsed = useShellStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useShellStore((s) => s.toggleSidebar);

  const section = sectionForPath(location.pathname);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 0 : 232, opacity: collapsed ? 0 : 1 }}
      transition={
        reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 32 }
      }
      className="flex shrink-0 flex-col border-r border-border bg-surface-2 overflow-hidden"
      aria-hidden={collapsed}
    >
      {!collapsed && (
        <div className="flex h-full w-[232px] flex-col">
          {/* Section header */}
          <button
            onClick={toggleSidebar}
            className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3.5 hover:bg-white/5 transition-colors"
            aria-label="Collapse sidebar"
          >
            <span className="truncate text-[15px] font-semibold tracking-tight">
              {section?.label ?? "GameStream"}
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>

          {/* Sub-navigation */}
          <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-1">
            <NavLink
              to="/home"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <Plus className="size-4" />
              Discover
            </NavLink>
            {section?.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  cn(
                    "block rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* User panel */}
          <div className="shrink-0 border-t border-border bg-surface-3 p-2">
            <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
              <div className="relative">
                <div className="flex size-8 items-center justify-center rounded-full bg-blurple/25 text-sm font-semibold text-blurple">
                  GS
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface-3 bg-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">Player One</p>
                <p className="truncate text-xs text-muted-foreground">Online</p>
              </div>
              <div className="flex items-center gap-0.5 text-muted-foreground">
                <span className="flex size-7 items-center justify-center rounded-md hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer">
                  <span className="flex flex-col items-center gap-0.5">
                    <span className="h-1 w-1 rounded-full bg-current" />
                    <span className="h-1 w-1 rounded-full bg-current" />
                    <span className="h-1 w-1 rounded-full bg-current" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
