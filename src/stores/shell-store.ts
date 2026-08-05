import { create } from "zustand";

/**
 * Shell UI state. Kept in Zustand so it stays out of the React tree —
 * later features (voice activity, notifications, overlay toggles) can
 * read and write these without re-rendering the whole layout.
 */
interface ShellState {
  /** True when the secondary (contextual) sidebar is hidden. */
  sidebarCollapsed: boolean;
  /** True when the individual Gaming Hub icons are shown in the rail. */
  hubsExpanded: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleHubs: () => void;
  setHubsExpanded: (expanded: boolean) => void;
}

export const useShellStore = create<ShellState>()((set) => ({
  sidebarCollapsed: false,
  hubsExpanded: true,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

  toggleHubs: () => set((state) => ({ hubsExpanded: !state.hubsExpanded })),

  setHubsExpanded: (hubsExpanded) => set({ hubsExpanded }),
}));
