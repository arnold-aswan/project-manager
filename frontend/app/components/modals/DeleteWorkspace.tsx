import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import type { DeleteWorkspaceProps } from "@/types";
import { useDeleteWorkspaceMutation } from "@/hooks/useWorkspace";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const DeleteWorkspace = ({
	workspaceId,
	isDeletingWorkspace,
	setIsDeletingWorkspace,
}: DeleteWorkspaceProps) => {
	const { mutate, isPending } = useDeleteWorkspaceMutation();
	const navigate = useNavigate();

	const handleDeleteWorkspace = () => {
		mutate(workspaceId, {
			onSuccess: (data: any) => {
				toast.success(data.message);
				setIsDeletingWorkspace(false);
				navigate("/workspaces");
			},
			onError: (error: any) => {
				toast.error("Uh oh, failed to update workspace details.");
				console.error(error);
			},
		});
	};

	return (
		<Dialog
			open={isDeletingWorkspace}
			onOpenChange={setIsDeletingWorkspace}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle
						className="text-red-500
          "
					>
						Delete Workspace?
					</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this workspace? This action is
						permanent and cannot be undone. All associated data will be lost.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="!flex !items-center !justify-between ">
					<Button
						variant={"secondary"}
						onClick={() => setIsDeletingWorkspace(false)}
					>
						Cancel
					</Button>
					<Button
						variant={"destructive"}
						onClick={handleDeleteWorkspace}
						disabled={isPending}
					>
						{isPending ? "Deleting Workspace..." : "Continue"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteWorkspace;
