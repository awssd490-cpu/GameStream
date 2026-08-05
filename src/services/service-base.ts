/**
 * Service-layer contracts for GameStream's future backend systems.
 *
 * Nothing here is implemented — these are the typed seams that future
 * milestones (voice, streaming, presence, downloads, performance) will
 * fill. Keeping the shapes stable now means those milestones mount
 * without touching the UI architecture.
 */

/** Registry of the app's service namespaces. */
export const SERVICE_NAMESPACES = [
  "performance",
  "streaming",
  "voice",
  "presence",
  "notifications",
] as const;

export type ServiceNamespace = (typeof SERVICE_NAMESPACES)[number];
