import type { CreateTaskFormData } from "@/components/modals/CreateTask";
import { fetchData, postData, updateData } from "@/lib/fetch-utils";
import type { TaskPriority } from "@/types";
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

export const useTaskActivity = (resourceId: string) => {
	return useQuery({
		queryKey: ["task-activity", resourceId],
		queryFn: () => fetchData(`/tasks/${resourceId}/activity`),
		enabled: !!resourceId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: true,
	});
};

export const useGetCommentsByTaskIdQuery = (taskId: string) => {
	return useQuery({
		queryKey: ["comments", taskId],
		queryFn: () => fetchData(`/tasks/${taskId}/comments`),
		enabled: !!taskId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: true,
	});
};

export const useGetMyTasksQuery = () => {
	return useQuery({
		queryKey: ["my-tasks", "user"],
		queryFn: () => fetchData("/tasks/my-tasks"),
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
			const taskId = data?.task?._id;
			if (!taskId) return;

			queryClient.invalidateQueries({
				queryKey: ["task", taskId],
			});
			queryClient.invalidateQueries({
				queryKey: ["task-activity", taskId],
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
			const taskId = data?.task?._id;
			if (!taskId) return;

			queryClient.invalidateQueries({
				queryKey: ["task", taskId],
			});
			queryClient.invalidateQueries({
				queryKey: ["task-activity", taskId],
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
			const taskId = data?.task?._id;
			if (!taskId) return;

			queryClient.invalidateQueries({
				queryKey: ["task", taskId],
			});
			queryClient.invalidateQueries({
				queryKey: ["task-activity", taskId],
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
			const taskId = data?.task?._id;
			if (!taskId) return;

			queryClient.invalidateQueries({
				queryKey: ["task", taskId],
			});
			queryClient.invalidateQueries({
				queryKey: ["task-activity", taskId],
			});
		},
	});
};

export const useUpdateTaskPriorityMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { taskId: string; priority: TaskPriority }) => {
			return updateData(`/tasks/${data.taskId}/priority`, {
				priority: data.priority,
			});
		},
		onSuccess: (data: any) => {
			const taskId = data?.task?._id;
			if (!taskId) return;

			queryClient.invalidateQueries({
				queryKey: ["task", taskId],
			});
			queryClient.invalidateQueries({
				queryKey: ["task-activity", taskId],
			});
		},
	});
};

export const useAddSubTaskMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { taskId: string; title: string }) => {
			return postData(`/tasks/${data.taskId}/add-subtask`, {
				title: data.title,
			});
		},
		onSuccess: (data: any) => {
			const taskId = data?.task?._id;
			if (!taskId) return;

			queryClient.invalidateQueries({
				queryKey: ["task", taskId],
			});
			queryClient.invalidateQueries({
				queryKey: ["task-activity", taskId],
			});
		},
	});
};

export const useUpdateSubTaskMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: {
			taskId: string;
			subTaskId: string;
			completed: boolean;
		}) => {
			return updateData(
				`/tasks/${data.taskId}/update-subtask/${data.subTaskId}`,
				{
					completed: data.completed,
				}
			);
		},
		onSuccess: (data: any) => {
			const taskId = data?.task?._id;
			if (!taskId) return;

			queryClient.invalidateQueries({
				queryKey: ["task", taskId],
			});
			queryClient.invalidateQueries({
				queryKey: ["task-activity", taskId],
			});
		},
	});
};

export const useAddCommentMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { taskId: string; text: string }) => {
			return postData(`/tasks/${data.taskId}/add-comment`, {
				text: data.text,
			});
		},
		onSuccess: (data: any) => {
			const taskId = data?.task?._id;
			if (!taskId) return;

			queryClient.invalidateQueries({
				queryKey: ["comments", taskId],
			});
			queryClient.invalidateQueries({
				queryKey: ["task-activity", taskId],
			});
		},
	});
};

export const useWatchTaskMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { taskId: string }) =>
			postData(`/tasks/${data.taskId}/watch`, {}),
		onSuccess: (data: any) => {
			const taskId = data?.task?._id;
			if (!taskId) return;

			queryClient.invalidateQueries({
				queryKey: ["task", taskId],
			});
			queryClient.invalidateQueries({
				queryKey: ["task-activity", taskId],
			});
		},
	});
};

export const useArchiveMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { taskId: string }) =>
			postData(`/tasks/${data.taskId}/archive`, {}),
		onSuccess: (data: any) => {
			const taskId = data?.task?._id;
			if (!taskId) return;

			queryClient.invalidateQueries({
				queryKey: ["task", taskId],
			});
			queryClient.invalidateQueries({
				queryKey: ["task-activity", taskId],
			});
		},
	});
};
