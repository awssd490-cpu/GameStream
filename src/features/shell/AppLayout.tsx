import { ServerRail } from "./ServerRail";
import { SecondarySidebar } from "./SecondarySidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { AnimatedOutlet } from "@/components/shared/AnimatedOutlet";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useCommandPaletteStore } from "@/stores/palette-store";

/**
 * The application shell. Fixed three-zone layout:
 *
 *   [rail] [sidebar] [  top bar  ]
 *   [rail] [sidebar] [  content  ]
 *
 * The rail and sidebar are fixed width; the content area scrolls. Page
 * transitions run in the content area via AnimatedOutlet. The command
 * palette is shell-owned so it can overlay any route.
 */
export function AppLayout() {
  const togglePalette = useCommandPaletteStore((s) => s.togglePalette);
  const openPalette = useCommandPaletteStore((s) => s.openPalette);

  // Ctrl+K opens the palette from anywhere in the app.
  useKeyboardShortcut(["ctrl+k"], () => {
    const state = useCommandPaletteStore.getState();
    if (!state.open) {
      openPalette();
    } else {
      togglePalette();
    }
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-2 text-foreground">
      <ServerRail />
      <SecondarySidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="relative flex min-h-0 flex-1 flex-col bg-surface-3">
          <AnimatedOutlet />
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
