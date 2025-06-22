import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "@/types";
import { queryClient } from "@/providers/react-query-provider";

const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			isAuthenticated: false,
			user: null,
			loginSuccess: (user: User) => set({ isAuthenticated: true, user }),
			logout: () => {
				set({ isAuthenticated: false, user: null });
				queryClient.clear();
			},
		}),
		{
			name: "taskhub-auth",
		}
	)
);

export default useAuthStore;
