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
