import { create } from "zustand";

/**
 * Friends UI state. Deliberately tiny: holds only the selected friend's
 * id so the profile drawer can render. The friend list itself stays in
 * feature-owned data (friends-data.ts), which a future presence service
 * will replace. Keeping this minimal means opening a drawer does not
 * re-render the list.
 */
interface FriendsState {
  selectedFriendId: string | null;
  openProfile: (friendId: string) => void;
  closeProfile: () => void;
}

export const useFriendsStore = create<FriendsState>()((set) => ({
  selectedFriendId: null,

  openProfile: (selectedFriendId) => set({ selectedFriendId }),

  closeProfile: () => set({ selectedFriendId: null }),
}));
