import { useEffect } from "react";

type Handler = (event: KeyboardEvent) => void;

/**
 * Registers a global keydown listener for a keyboard combination.
 * `handler` is kept in a ref so callers can pass an inline closure
 * without re-subscribing on every render.
 *
 * Combo format: "ctrl+k", "alt+shift+p" etc. Ctrl also accepts Meta.
 * Ignored while typing in inputs/textareas.
 */
export function useKeyboardShortcut(
  combos: string[],
  handler: Handler,
  deps: readonly unknown[] = [],
) {
  useEffect(() => {
    const handlerRef = { current: handler };
    handlerRef.current = handler;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }

      const key = event.key.toLowerCase();
      const hasCtrl = event.ctrlKey || event.metaKey;
      const hasAlt = event.altKey;
      const hasShift = event.shiftKey;

      const matches = combos.some((combo) => {
        const parts = combo.toLowerCase().split("+");
        const comboKey = parts[parts.length - 1];
        const hasComboCtrl = parts.includes("ctrl");
        const hasComboAlt = parts.includes("alt");
        const hasComboShift = parts.includes("shift");
        return (
          key === comboKey &&
          hasCtrl === hasComboCtrl &&
          hasAlt === hasComboAlt &&
          hasShift === hasComboShift
        );
      });

      if (matches) {
        event.preventDefault();
        handlerRef.current(event);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // deps intentionally referenced for linters; the ref keeps handler fresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}
