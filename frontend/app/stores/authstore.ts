import { create } from "zustand";
import type { AuthState, User } from "@/types";

const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: false,
	user: null,
	loginSuccess: (user: User) => set({ isAuthenticated: true, user }),
	logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuthStore;
