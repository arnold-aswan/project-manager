import type { CreateProjectFormData } from "@/components/modals/CreateProject";
import { fetchData, postData } from "@/lib/fetch-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: {
			projectData: CreateProjectFormData;
			workspaceId: string;
		}) => {
			return postData(
				`/projects/${data.workspaceId}/create-project`,
				data.projectData
			);
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({
				queryKey: ["workspace", data.workspace],
			});
		},
	});
};

export const useGetProjectsQuery = (projectId: string) => {
	return useQuery({
		queryKey: ["project", projectId],
		queryFn: async () => fetchData(`/projects/${projectId}/tasks`),
		enabled: !!projectId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: true,
	});
};

export const useGetArchivedProjectsAndTasksQuery = (workspaceId: string) => {
	return useQuery({
		queryKey: ["archived", workspaceId],
		queryFn: async () => fetchData(`/projects/${workspaceId}/archived`),
		enabled: !!workspaceId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: true,
	});
};

export const useArchiveProjectMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ projectId }: { projectId: string }) =>
			postData(`/projects/${projectId}/archive`, {}),
		onSuccess: (data: any) => {
			const projectId = data?.project?._id;
			if (!projectId) return;

			queryClient.invalidateQueries({
				queryKey: ["project", projectId, data.project],
			});
			queryClient.invalidateQueries({
				queryKey: ["archived"],
			});
		},
	});
};
