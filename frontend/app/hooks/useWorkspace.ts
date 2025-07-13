import type { WorkspaceFormData } from "@/components/workspace/create-workspace";
import { fetchData, postData } from "@/lib/fetch-utils";
import type { Project, Workspace } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
	return useMutation({
		mutationFn: (data: WorkspaceFormData) =>
			postData("/workspaces/create-workspace", data),
	});
};

export const useGetWorkspaces = () => {
	return useQuery({
		queryKey: ["workspaces"],
		queryFn: async () => fetchData("/workspaces"),
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: true,
	});
};

export const useGetWorkspaceQuery = (workspaceId: string) => {
	return useQuery<{ workspace: Workspace; projects: Project[] }>({
		queryKey: ["workspace", workspaceId],
		queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
		enabled: !!workspaceId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: true,
	});
};

export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
	return useQuery({
		queryKey: ["workspace", workspaceId, "stats"],
		queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`),
		enabled: !!workspaceId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: true,
	});
};

export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
	return useQuery({
		queryKey: ["workspace", workspaceId, "details"],
		queryFn: async () => fetchData(`/workspaces/${workspaceId}`),
		enabled: !!workspaceId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: true,
	});
};
