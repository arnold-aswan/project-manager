import type { WorkspaceFormData } from "@/components/workspace/create-workspace";
import { postData } from "@/lib/fetch-utils";
import { useMutation } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
	return useMutation({
		mutationFn: (data: WorkspaceFormData) =>
			postData("/workspaces/create-workspace", data),
	});
};
