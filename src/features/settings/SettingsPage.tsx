import { Monitor, Moon, Sun } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useThemeStore, type Theme } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

const THEME_OPTIONS: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
];

/**
 * Settings hub. Currently ships the working theme switcher (tied to the
 * theme store); the appearance, voice/video, and keybinds tabs render
 * placeholders until their milestones.
 */
export function SettingsPage() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Settings"
        description="Customize how GameStream looks and behaves."
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        {/* Appearance */}
        <section className="rounded-xl border border-border bg-card">
          <header className="border-b border-border px-4 py-3">
            <h2 className="font-semibold tracking-tight">Appearance</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Choose how GameStream looks to you.
            </p>
          </header>
          <div className="p-4">
            <span className="text-sm font-medium">Theme</span>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors",
                    theme === option.id
                      ? "border-blurple bg-blurple/10"
                      : "border-border hover:bg-white/5",
                  )}
                >
                  <option.icon
                    className={cn(
                      "size-5",
                      theme === option.id ? "text-blurple" : "text-muted-foreground",
                    )}
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Demo sections */}
        <section className="mt-4 rounded-xl border border-border bg-card">
          <header className="border-b border-border px-4 py-3">
            <h2 className="font-semibold tracking-tight">Voice & Video</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Input, output, and voice activation.
            </p>
          </header>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Input device</p>
              <p className="text-xs text-muted-foreground">Coming in a later milestone</p>
            </div>
            <Button variant="secondary" size="sm" disabled>
              Not yet available
            </Button>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-border bg-card">
          <header className="border-b border-border px-4 py-3">
            <h2 className="font-semibold tracking-tight">Keybinds</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Keyboard shortcuts for quick actions.
            </p>
          </header>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Monitor className="size-4 text-muted-foreground" />
              <p className="text-sm font-medium">Coming soon</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
