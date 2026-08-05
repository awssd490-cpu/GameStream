import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search } from "lucide-react";

import {
  buildPaletteCommands,
  matchCommands,
  setPaletteNavigator,
  type PaletteGroup,
} from "@/features/shell/commands";
import { useCommandPaletteStore } from "@/stores/palette-store";
import { cn } from "@/lib/utils";

/**
 * Production command palette. Opens with Ctrl+K (wired in the shell),
 * groups results, and is fully keyboard-operable:
 * Up/Down to move, Enter to select, Esc to close, focus restored on exit.
 *
 * `items` is memoized once — the registry is static at runtime, so
 * filtering is the only per-keystroke work.
 */
export function CommandPalette() {
  const navigate = useNavigate();
  const open = useCommandPaletteStore((s) => s.open);
  const query = useCommandPaletteStore((s) => s.query);
  const setQuery = useCommandPaletteStore((s) => s.setQuery);
  const closePalette = useCommandPaletteStore((s) => s.closePalette);

  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  // Wire the navigator once so the registry's commands can navigate.
  useEffect(() => {
    setPaletteNavigator((to) => {
      closePalette();
      navigate(to);
    });
  }, [navigate, closePalette]);

  const items = useMemo(() => buildPaletteCommands(), []);
  const results = useMemo(() => matchCommands(items, query), [items, query]);

  // Focus the input and reset selection each time the palette opens.
  useEffect(() => {
    if (open) {
      setSelected(0);
      setResetKey((k) => k + 1);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Keyboard handling for the whole palette.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      closePalette();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
      return;
    }
    if (event.key === "Enter" && results[selected]) {
      event.preventDefault();
      results[selected].item.onSelect();
    }
  };

  // If the active item scrolls out of view, keep it visible.
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>("[data-selected='true']");
    node?.scrollIntoView({ block: "nearest" });
  }, [selected, open]);

  // Group results for display, preserving registry order.
  const groups = useMemo(() => {
    const grouped = new Map<string, { group: PaletteGroup; indexes: number[] }>();
    results.forEach((source, index) => {
      const existing = grouped.get(source.group.id);
      if (existing) {
        existing.indexes.push(index);
      } else {
        grouped.set(source.group.id, { group: source.group, indexes: [index] });
      }
    });
    return [...grouped.values()];
  }, [results]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[18vh] backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closePalette();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            onKeyDown={onKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-[560px] max-w-[90vw] overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
          >
            {/* Input row */}
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                key={resetKey}
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                placeholder="Type a command or search…"
                spellCheck={false}
                className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Command query"
              />
              <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[360px] overflow-y-auto p-2">
              {groups.length === 0 ? (
                <div className="flex flex-col items-center gap-1 py-10 text-center">
                  <p className="text-sm text-muted-foreground">No results for “{query}”</p>
                  <p className="text-xs text-muted-foreground/60">Try “hubs”, “library” or “streams”.</p>
                </div>
              ) : (
                groups.map(({ group, indexes }) => (
                  <div key={group.id} className="mb-1">
                    <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </p>
                    {indexes.map((resultIndex) => {
                      const source = results[resultIndex];
                      const isSelected = resultIndex === selected;
                      return (
                        <button
                          key={source.item.id}
                          data-selected={isSelected}
                          onMouseEnter={() => setSelected(resultIndex)}
                          onClick={source.item.onSelect}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                            isSelected ? "bg-white/10" : "hover:bg-white/5",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-md",
                              isSelected ? "bg-blurple text-blurple-foreground" : "bg-guild text-muted-foreground",
                            )}
                          >
                            <source.item.icon className="size-4" strokeWidth={1.75} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{source.item.label}</span>
                            {source.item.hint && (
                              <span className="block truncate text-xs text-muted-foreground">
                                {source.item.hint}
                              </span>
                            )}
                          </span>
                          {isSelected && (
                            <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border px-1 py-0.5">↑</kbd>
                <kbd className="rounded border border-border px-1 py-0.5">↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border px-1 py-0.5">↵</kbd>
                open
              </span>
              <span className="ml-auto">
                {results.length} {results.length === 1 ? "command" : "commands"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
