import { useEffect, type PropsWithChildren } from "react";
import { useThemeStore } from "@/stores/theme-store";

/**
 * Applies the persisted theme to the document on mount and whenever
 * the theme store changes. The boot script in index.html already sets
 * the initial class pre-paint, so this only reconciles on changes.
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
  }, [theme]);

  return <>{children}</>;
}
