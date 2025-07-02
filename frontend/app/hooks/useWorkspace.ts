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
		staleTime: 60 * 60 * 10,
	});
};

export const useGetWorkspaceQuery = (workspaceId: string) => {
	return useQuery<{ workspace: Workspace; projects: Project[] }>({
		queryKey: ["workspace", workspaceId],
		queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
		staleTime: 60 * 60 * 10,
	});
};
