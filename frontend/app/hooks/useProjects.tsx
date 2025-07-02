import type { CreateProjectFormData } from "@/components/modals/CreateProject";
import { postData } from "@/lib/fetch-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
