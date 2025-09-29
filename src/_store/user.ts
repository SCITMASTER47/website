import { create } from "zustand";
import { User, UserSchedule, UserSearchResult } from "@/_types/user";
import { Schedule } from "@/_types/schedule";
import { addFavorite, removeFavorite } from "@/_action/users";

interface UserState {
  // 사용자 목록 관련
  users: User[];
  selectedUser: User | null;
  // 로딩 상태
  isLoadingUsers: boolean;
  isLoadingProfile: boolean;
  isLoadingSchedules: boolean;
  isLoadingFavorites: boolean;

  // 검색 관련
  searchQuery: string;
  currentPage: number;

  // Actions
  setUsers: (users: User[]) => void;
  setSelectedUser: (user: User | null) => void;

  // Loading actions
  setLoadingUsers: (loading: boolean) => void;
  setLoadingProfile: (loading: boolean) => void;
  setLoadingSchedules: (loading: boolean) => void;
  setLoadingFavorites: (loading: boolean) => void;

  // Search actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  clearSearch: () => void;

  // Favorite actions
  addFavorite: (userId: string) => Promise<boolean>;
  removeFavorite: (userId: string) => Promise<boolean>;
  toggleFavorite: (user: User) => Promise<void>;
  isFavorite: (userId: string) => boolean;
  updateUserFavoriteStatus: (userId: string, isFavorite: boolean) => void;
}

const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,

  isLoadingUsers: false,
  isLoadingProfile: false,
  isLoadingSchedules: false,
  isLoadingFavorites: false,

  searchQuery: "",
  currentPage: 1,

  // Basic setters
  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  // Loading setters
  setLoadingUsers: (loading) => set({ isLoadingUsers: loading }),
  setLoadingProfile: (loading) => set({ isLoadingProfile: loading }),
  setLoadingSchedules: (loading) => set({ isLoadingSchedules: loading }),
  setLoadingFavorites: (loading) => set({ isLoadingFavorites: loading }),

  // Search actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentPage: (page) => set({ currentPage: page }),
  clearSearch: () =>
    set({
      searchQuery: "",
      currentPage: 1,
    }),

  // Favorite actions
  addFavorite: async (userId) => {
    try {
      await addFavorite(userId);

      get().updateUserFavoriteStatus(userId, true);

      return true;
    } catch (error) {
      console.error("Failed to add favorite:", error);
      return false;
    }
  },

  removeFavorite: async (userId) => {
    try {
      await removeFavorite(userId);

      get().updateUserFavoriteStatus(userId, false);

      return true;
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      return false;
    }
  },

  toggleFavorite: async (user) => {
    const currentIsFavorite = user.favorite ?? false;

    if (currentIsFavorite) {
      await get().removeFavorite(user.id);
    } else {
      await get().addFavorite(user.id);
    }
  },

  isFavorite: (userId) => {
    const { users } = get();
    const user = users.find((u) => u.id === userId);
    return user?.favorite ?? false;
  },

  updateUserFavoriteStatus: (userId, isFavorite) => {
    const { users } = get();
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, favorite: isFavorite } : user
    );
    set({ users: updatedUsers });
  },
}));

export default useUserStore;
