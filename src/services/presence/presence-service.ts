/**
 * Presence service contract (architectural placeholder).
 *
 * Feeds the friend list, hub rosters, rich presence and "what's
 * everyone playing" surfaces. A future milestone implements the
 * transport (likely WebSocket) that drives these events.
 *
 * No implementation yet — the shape is the contract.
 */

export type PresenceStatus = "online" | "idle" | "dnd" | "offline";

export interface RichPresence {
  /** The game currently running, if any. */
  game?: string;
  detail?: string;
  startedAt?: number;
}

export interface PresenceUser {
  id: string;
  name: string;
  status: PresenceStatus;
  presence: RichPresence;
}

export type PresenceEvent =
  | { type: "user-connected"; user: PresenceUser }
  | { type: "user-updated"; user: PresenceUser }
  | { type: "user-disconnected"; userId: string };

export interface PresenceService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  onEvent(callback: (event: PresenceEvent) => void): () => void;
  /** Push the local user's own presence/rich-presence. */
  updateSelf(presence: RichPresence): Promise<void>;
}

/**
 * No-op default so imports compile today. The presence milestone
 * replaces this singleton; consumers depend only on the interface.
 */
export const presenceService: PresenceService = {
  connect: async () => {},
  disconnect: async () => {},
  onEvent: () => () => {},
  updateSelf: async () => {},
};
