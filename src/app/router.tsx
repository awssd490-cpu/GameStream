import { lazy } from "react";
import { createHashRouter } from "react-router-dom";

import { AppLayout } from "@/features/shell/AppLayout";

/**
 * Lazy route-level code splitting: each feature loads independently,
 * so the shell (rail, top bar, command palette) ships in the initial
 * chunk and every page is fetched on first navigation.
 */
const HomePage = lazy(() =>
  import("@/features/home/HomePage").then((m) => ({ default: m.HomePage })),
);
const FriendsPage = lazy(() =>
  import("@/features/friends/FriendsPage").then((m) => ({ default: m.FriendsPage })),
);
const MessagesPage = lazy(() =>
  import("@/features/messages/MessagesPage").then((m) => ({ default: m.MessagesPage })),
);
const HubsPage = lazy(() =>
  import("@/features/hubs/HubsPage").then((m) => ({ default: m.HubsPage })),
);
const HubDetailPage = lazy(() =>
  import("@/features/hubs/HubDetailPage").then((m) => ({ default: m.HubDetailPage })),
);
const StreamsPage = lazy(() =>
  import("@/features/streams/StreamsPage").then((m) => ({ default: m.StreamsPage })),
);
const SessionsPage = lazy(() =>
  import("@/features/sessions/SessionsPage").then((m) => ({ default: m.SessionsPage })),
);
const LibraryPage = lazy(() =>
  import("@/features/library/LibraryPage").then((m) => ({ default: m.LibraryPage })),
);
const DownloadsPage = lazy(() =>
  import("@/features/downloads/DownloadsPage").then((m) => ({ default: m.DownloadsPage })),
);
const SettingsPage = lazy(() =>
  import("@/features/settings/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);

/**
 * Application routes.
 *
 * Hash-based router: in a Tauri production build the frontend is served
 * from the tauri:// custom protocol with no server to resolve deep
 * links, so BrowserRouter history would break on reload/launch. Hash
 * routing is deterministic across both dev and packaged builds.
 */
export const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/friends", element: <FriendsPage /> },
      { path: "/messages", element: <MessagesPage /> },
      { path: "/hubs", element: <HubsPage /> },
      { path: "/hubs/:hubId", element: <HubDetailPage /> },
      { path: "/streams", element: <StreamsPage /> },
      { path: "/sessions", element: <SessionsPage /> },
      { path: "/library", element: <LibraryPage /> },
      { path: "/downloads", element: <DownloadsPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);
