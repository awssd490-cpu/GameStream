import { Suspense } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Renders the current route outlet with an enter/exit animation.
 * Keyed by pathname so AnimatePresence can cross-fade between pages.
 * Exit animations are omitted on the initial mount to avoid a flash.
 *
 * Each route is a lazy chunk, so the outlet is wrapped in Suspense;
 * the fallback is a minimal centered spinner rather than a layout jump.
 */
export function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="h-full min-h-0 overflow-y-auto"
      >
        <Suspense
          fallback={
            <div className="flex h-full min-h-[40vh] items-center justify-center">
              <span className="size-5 animate-spin rounded-full border-2 border-border border-t-blurple" />
            </div>
          }
        >
          {outlet}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
