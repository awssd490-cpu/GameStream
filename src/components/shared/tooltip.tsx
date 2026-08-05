import { type ReactNode, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import { cn } from "@/lib/utils";

type Side = "right" | "bottom";

interface TooltipProps {
  content: string;
  side?: Side;
  children: ReactNode;
}

/**
 * Lightweight hover tooltip built on framer-motion. Used by the rail
 * for icon labels — no portal needed since the rail is fully painted.
 * framer-motion owns the whole transform (including the centering
 * translate) so it never fights the CSS transform utilities.
 */
export function Tooltip({ content, side = "right", children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const delayTimer = useRef<number | null>(null);

  const openWithDelay = () => {
    // Small delay so accidental mouse passes don't pop the tooltip.
    delayTimer.current = window.setTimeout(() => setOpen(true), 350);
  };

  const close = () => {
    if (delayTimer.current) window.clearTimeout(delayTimer.current);
    setOpen(false);
  };

  const centeredX = "-50%" as const;
  const centeredY = "-50%" as const;
  const slideOffset = 6;

  // The centering translate must always be present; only the slide
  // offset animates. Right side centers vertically (y=-50%), bottom
  // centers horizontally (x=-50%).
  const initial = reduceMotion
    ? { opacity: 0 }
    : side === "right"
      ? { opacity: 0, x: -slideOffset, y: centeredY }
      : { opacity: 0, x: centeredX, y: -slideOffset };

  const animate = reduceMotion
    ? { opacity: 1 }
    : side === "right"
      ? { opacity: 1, x: 0, y: centeredY }
      : { opacity: 1, x: centeredX, y: 0 };

  return (
    <div
      className="relative"
      onMouseEnter={openWithDelay}
      onMouseLeave={close}
      onFocus={openWithDelay}
      onBlur={close}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            initial={initial}
            animate={animate}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-border bg-surface-4 px-2.5 py-1.5",
              "text-xs font-medium text-foreground shadow-lg",
              side === "right"
                ? "top-1/2 left-full ml-3"
                : "top-full left-1/2 mt-2",
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
