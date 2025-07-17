import type { InviteMemberFormData } from "@/components/modals/InviteMemberDialog";
import type { WorkspaceFormData } from "@/components/workspace/create-workspace";
import { deleteData, fetchData, postData, updateData } from "@/lib/fetch-utils";
import type { Project, Workspace } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useInviteMemberMutation = () => {
	return useMutation({
		mutationFn: async (data: {
			email: string;
			role: string;
			workspaceId: string;
		}) => {
			postData(`/workspaces/${data.workspaceId}/invite-member`, data);
		},
	});
};

export const useAcceptInviteByTokenMutation = () => {
	return useMutation({
		mutationFn: (token: string) =>
			postData(`/workspaces/accept-invite-token`, {
				token,
			}),
	});
};

export const useAcceptGenerateInviteMutation = () => {
	return useMutation({
		mutationFn: (workspaceId: string) =>
			postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
	});
};

export const useUpdateWorkspaceDetailsMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: {
			workspaceData: WorkspaceFormData;
			workspaceId: string;
		}) => {
			return updateData(
				`/workspaces/${data.workspaceId}/update-workspace`,
				data.workspaceData
			);
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({
				queryKey: ["workspace", data.workspace],
			});
		},
	});
};

export const useDeleteWorkspaceMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (workspaceId: string) => {
			return deleteData(`/workspaces/${workspaceId}/delete-workspace`);
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({
				queryKey: ["workspaces"],
			});
			queryClient.invalidateQueries({
				queryKey: ["workspace", data.workspaceId],
			});
		},
	});
};

export const useTransferWorkspaceOwnershipMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: { newOwnerId: string; workspaceId: string }) => {
			return updateData(
				`/workspaces/${data.workspaceId}/transfer-workspace-ownership`,
				data
			);
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({
				queryKey: ["workspace", data.workspace],
			});
		},
	});
};
