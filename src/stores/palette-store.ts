import { create } from "zustand";

/**
 * Command palette UI state. Deliberately a tiny store so any surface
 * (top bar search, global shortcut, future in-game overlay) can open
 * the palette without prop-drilling or re-rendering the layout.
 */
interface CommandPaletteState {
  open: boolean;
  query: string;
  setQuery: (query: string) => void;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>()((set) => ({
  open: false,
  query: "",

  setQuery: (query) => set({ query }),

  openPalette: () => set({ open: true }),

  closePalette: () => set({ open: false, query: "" }),

  togglePalette: () =>
    set((state) => ({ open: !state.open, query: state.open ? "" : state.query })),
}));
