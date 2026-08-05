import { cn } from "@/lib/utils";
import type { FriendStatus } from "./friends-data";

/** Display label for a presence status. */
export function statusLabel(status: FriendStatus): string {
  switch (status) {
    case "in-game":
      return "In Game";
    case "online":
      return "Online";
    case "idle":
      return "Idle";
    case "offline":
      return "Offline";
  }
}

/** Dot color for a presence status. */
export function statusDotClass(status: FriendStatus): string {
  switch (status) {
    case "in-game":
      return "bg-blurple";
    case "online":
      return "bg-emerald-500";
    case "idle":
      return "bg-amber-500";
    case "offline":
      return "bg-muted-foreground";
  }
}

/** Ordering priority for grouping (lower sorts first). */
export const statusPriority: Record<FriendStatus, number> = {
  "in-game": 0,
  online: 1,
  idle: 2,
  offline: 3,
};

/** Group heading for a presence status. */
export function statusGroupLabel(status: FriendStatus): string {
  switch (status) {
    case "in-game":
      return "In Game";
    case "online":
      return "Online";
    case "idle":
      return "Idle";
    case "offline":
      return "Offline";
  }
}

/** Single presence dot, with a pulse for in-game. */
export function StatusDot({
  status,
  className,
  size = "sm",
}: {
  status: FriendStatus;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "relative block shrink-0 rounded-full",
        size === "sm" ? "size-2.5" : "size-3",
        statusDotClass(status),
        status === "in-game" && "animate-pulse",
        className,
      )}
      aria-hidden
    />
  );
}

/** Avatar with a status dot overlay. */
export function StatusAvatar({
  initials,
  status,
  size = "md",
  className,
}: {
  initials: string;
  status: FriendStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-blurple/25 font-semibold text-blurple",
          size === "sm" && "size-8 text-xs",
          size === "md" && "size-10 text-sm",
          size === "lg" && "size-14 text-lg",
        )}
      >
        {initials}
      </span>
      <span
        className={cn(
          "absolute -right-0.5 -bottom-0.5 rounded-full border-2 border-card",
          size === "sm" && "size-3",
          size === "md" && "size-3.5",
          size === "lg" && "size-4",
          statusDotClass(status),
          status === "in-game" && "animate-pulse",
        )}
        aria-hidden
      />
    </span>
  );
}
