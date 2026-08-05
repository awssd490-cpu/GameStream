import { create } from "zustand";

export type Theme = "dark" | "light";
export type ResolvedTheme = Theme;

const STORAGE_KEY = "gs-theme";

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

interface ThemeState {
  /** The theme currently applied to the document. */
  theme: Theme;
  /** Persist the theme to localStorage and apply it to <html>. */
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: readStoredTheme(),

  setTheme: (theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage may be unavailable; the in-memory state still applies.
    }
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      useThemeStore.getState().setTheme(next);
      return { theme: next };
    }),
}));
