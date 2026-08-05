import { NavLink, useLocation } from "react-router-dom";
import { Bell, Headphones, Mic, PanelLeft, Search } from "lucide-react";

import { WindowControls } from "@/components/shared/WindowControls";
import { useCommandPaletteStore } from "@/stores/palette-store";
import { useShellStore } from "@/stores/shell-store";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const SETTINGS_TABS = ["General", "Appearance", "Voice & Video", "Keybinds"] as const;

function settingsTabPath(tab: string) {
  return tab === "General" ? "/settings" : `/settings/${tab.toLowerCase().replace(/ & /g, "-")}`;
}

function isSettingsTabActive(pathname: string, tab: string) {
  return tab === "General"
    ? pathname === "/settings"
    : pathname.endsWith("/" + tab.toLowerCase().replace(" & ", "-"));
}

/**
 * Top navigation bar. Layout is designed so native window controls slot
 * into the reserved right region without a redesign. The left region is
 * a drag zone (titleBarStyle: Overlay); interactive elements carry
 * `no-drag`. The search field is the gateway to the command palette.
 */
export function TopBar() {
  const location = useLocation();
  const toggleSidebar = useShellStore((s) => s.toggleSidebar);
  const sidebarCollapsed = useShellStore((s) => s.sidebarCollapsed);
  const openPalette = useCommandPaletteStore((s) => s.openPalette);
  const compact = useMediaQuery("(max-width: 760px)");
  const inSettings = location.pathname.startsWith("/settings");

  return (
    <div className="relative flex h-12 shrink-0 items-center border-b border-border bg-surface-2">
      {/* Sidebar toggle + drag region */}
      <div className="drag-region flex h-full flex-1 min-w-0 items-center gap-2 pl-3">
        <button
          onClick={toggleSidebar}
          className="no-drag flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="size-4.5" />
        </button>

        {inSettings ? (
          <nav className="no-drag flex items-center gap-1" aria-label="Settings sections">
            {SETTINGS_TABS.map((tab) => (
              <NavLink
                key={tab}
                to={settingsTabPath(tab)}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  isSettingsTabActive(location.pathname, tab)
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                {tab}
              </NavLink>
            ))}
          </nav>
        ) : (
          <div className="no-drag flex min-w-0 flex-1 items-center gap-2">
            <button
              onClick={openPalette}
              className="flex h-8 w-full max-w-sm items-center gap-2 rounded-md bg-black/30 px-2.5 text-muted-foreground transition-colors hover:bg-black/40 hover:text-foreground focus-visible:bg-black/40 focus-visible:text-foreground focus-visible:outline-none"
              aria-label="Open command palette"
              title="Open command palette (Ctrl+K)"
            >
              <Search className="size-4 shrink-0" />
              <span className="flex-1 text-left text-sm">Search GameStream</span>
              <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground lg:inline">
                CTRL K
              </kbd>
            </button>
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="no-drag flex shrink-0 items-center">
        {!inSettings && (
          <div className="flex items-center gap-0.5">
            <button
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="size-4.5" />
            </button>
            {!compact && (
              <>
                <button
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label="Mute microphone"
                  title="Mute microphone"
                >
                  <Mic className="size-4.5" />
                </button>
                <button
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label="Deafen"
                  title="Deafen"
                >
                  <Headphones className="size-4.5" />
                </button>
              </>
            )}
          </div>
        )}

        <div className="mx-1 h-6 w-px bg-border" aria-hidden />

        {/* Reserved window-control region (native controls overlay here in Tauri) */}
        <WindowControls />
      </div>
    </div>
  );
}
