/**
 * Notifications service contract (architectural placeholder).
 *
 * Surfacing toast/badge notifications for DMs, hub events, streams
 * going live and download completions. A future milestone implements
 * the queue, persistence and OS notification bridge.
 *
 * No implementation yet — the shape is the contract.
 */

export type NotificationKind =
  | "dm"
  | "mention"
  | "hub-event"
  | "stream-live"
  | "download-complete"
  | "system";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** A route to navigate to when the notification is activated. */
  href?: string;
  createdAt: number;
  read: boolean;
}

export interface NotificationsService {
  /** Push a notification through the queue. */
  notify(notification: Omit<AppNotification, "id" | "createdAt" | "read">): Promise<void>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
  list(): Promise<AppNotification[]>;
  onNotification(callback: (notification: AppNotification) => void): () => void;
}

/**
 * No-op default so imports compile today. The notifications milestone
 * replaces this singleton; consumers depend only on the interface.
 */
export const notificationsService: NotificationsService = {
  notify: async () => {},
  markRead: async () => {},
  markAllRead: async () => {},
  list: async () => [],
  onNotification: () => () => {},
};
