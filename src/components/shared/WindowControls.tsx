import { Maximize, Minus, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface WindowControlsProps {
  /** Reserve the space even when the controls are inert (custom titlebar prep). */
  reserved?: boolean;
}

const controlClass =
  "flex h-8 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors";

/**
 * The three window controls. With Tauri's `titleBarStyle: Overlay` the
 * native controls render on top of this region, so in dev this component
 * reserves the exact space they occupy and can never be mis-hit.
 *
 * When a future milestone switches to `titleBarStyle: Hidden`, wire
 * `@tauri-apps/api/window` getCurrentWindow().minimize()/toggleMaximize()/close()
 * here — the layout needs no redesign, only these three handlers.
 */
export function WindowControls({ reserved = true }: WindowControlsProps) {
  return (
    <div
      className="no-drag flex shrink-0 items-center gap-0.5"
      aria-label="Window controls"
    >
      <button className={cn(controlClass, reserved ? "pointer-events-none" : "hover:bg-white/10 hover:text-foreground")} aria-label="Minimize" tabIndex={reserved ? -1 : 0}>
        <Minus className="size-4" />
      </button>
      <button className={cn(controlClass, reserved ? "pointer-events-none" : "hover:bg-white/10 hover:text-foreground")} aria-label="Maximize" tabIndex={reserved ? -1 : 0}>
        <Maximize className="size-4" />
      </button>
      <button className={cn(controlClass, reserved ? "pointer-events-none" : "hover:bg-red-600 hover:text-white")} aria-label="Close" tabIndex={reserved ? -1 : 0}>
        <X className="size-4" />
      </button>
    </div>
  );
}
