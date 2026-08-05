import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface PlaceholderStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

/**
 * Empty-state view used while a feature's real content arrives in later
 * milestones. Composed of a floating icon, heading, and description so
 * every placeholder shares the same visual language.
 */
export function PlaceholderState({
  icon: Icon,
  title,
  description,
  className,
}: PlaceholderStateProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-4 px-8 text-center",
        className,
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex size-16 items-center justify-center rounded-2xl border border-border bg-surface-3 shadow-inner"
      >
        <Icon className="size-7 text-muted-foreground" strokeWidth={1.5} />
      </motion.div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
