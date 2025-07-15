import { useMutation, useQuery, type QueryKey } from "@tanstack/react-query";
import { fetchData, updateData } from "@/lib/fetch-utils";
import type { ChangePasswordFormData, ProfileFormData } from "@/lib/schema";

export const useGetUserProfileQuery = () => {
	return useQuery({
		queryKey: ["user"],
		queryFn: () => fetchData("/user/profile"),
	});
};

export const useChangePassword = () => {
	return useMutation({
		mutationFn: (data: ChangePasswordFormData) =>
			updateData("/user/change-password", data),
	});
};

export const useUpdateUserProfile = () => {
	return useMutation({
		mutationFn: (data: ProfileFormData) => updateData("/user/profile", data),
	});
};
