import { create } from "zustand";

/**
 * Game Sessions UI state. Deliberately tiny: holds only the selected
 * session id and the active page tab. The session catalog lives in
 * feature-owned data (sessions-data.ts), which a future sessions
 * service will replace. Keeping this minimal means opening a detail
 * drawer does not re-render the session list.
 */
interface SessionsState {
  selectedSessionId: string | null;
  openSession: (sessionId: string) => void;
  closeSession: () => void;
}

export const useSessionsStore = create<SessionsState>()((set) => ({
  selectedSessionId: null,

  openSession: (selectedSessionId) => set({ selectedSessionId }),

  closeSession: () => set({ selectedSessionId: null }),
}));
