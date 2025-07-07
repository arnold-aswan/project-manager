import type { CreateTaskFormData } from "@/components/modals/CreateTask";
import { fetchData, postData, updateData } from "@/lib/fetch-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateTaskMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: {
			projectId: string;
			taskData: CreateTaskFormData;
		}) => {
			return postData(`/tasks/${data.projectId}/create-task`, data.taskData);
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({
				queryKey: ["project", data.project],
			});
		},
	});
};

export const useGetTaskByIdQuery = (taskId: string) => {
	return useQuery({
		queryKey: ["task", taskId],
		queryFn: async () => fetchData(`/tasks/${taskId}`),
		enabled: !!taskId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: true,
	});
};

export const useUpdateTaskTitleMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { taskId: string; title: string }) => {
			return updateData(`/tasks/${data.taskId}/title`, {
				title: data.title,
			});
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({
				queryKey: ["task", data.task._id],
			});
		},
	});
};

export const useUpdateTaskStatusMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { taskId: string; status: string }) => {
			return updateData(`/tasks/${data.taskId}/status`, {
				status: data.status,
			});
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({
				queryKey: ["task", data.task._id],
			});
		},
	});
};

export const useUpdateTaskDescriptionMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { taskId: string; description: string }) => {
			return updateData(`/tasks/${data.taskId}/description`, {
				description: data.description,
			});
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({
				queryKey: ["task", data.task._id],
			});
		},
	});
};

export const useUpdateTaskAssigneesMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { taskId: string; assignees: string[] }) => {
			return updateData(`/tasks/${data.taskId}/assignees`, {
				assignees: data.assignees,
			});
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({
				queryKey: ["task", data.task._id],
			});
		},
	});
};
