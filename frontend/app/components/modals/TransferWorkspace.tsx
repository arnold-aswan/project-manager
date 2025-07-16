import type { TransferWorkspaceProps } from "@/types";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTransferWorkspaceOwnershipMutation } from "@/hooks/useWorkspace";
import { toast } from "sonner";

const TransferWorkspace = ({
	workspaceId,
	workspaceMembers,
	isTransferringWorkspace,
	setIsTransferringWorkspace,
}: TransferWorkspaceProps) => {
	const { mutate, isPending } = useTransferWorkspaceOwnershipMutation();

	const handleTransferWorkspaceOwnership = (newOwnerId: string) => {
		mutate(
			{ newOwnerId, workspaceId },
			{
				onSuccess: (data: any) => {
					toast.success(data.message);
					setIsTransferringWorkspace(false);
				},
				onError: (error: any) => {
					toast.error("Uh oh, failed to transfer workspace ownership!");
					console.error(error);
				},
			}
		);
	};

	return (
		<Dialog
			open={isTransferringWorkspace}
			onOpenChange={setIsTransferringWorkspace}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Transfer Workspace Ownership.</DialogTitle>
					<DialogDescription>
						Are you sure you want to transfer ownership of this workspace? Once
						transferred, you will lose administrative control, and the new owner
						will have full permissions to manage this workspace and its members.
					</DialogDescription>
				</DialogHeader>

				{/* workspace members */}
				<div>
					{workspaceMembers?.map((member) => (
						<div
							key={member?._id}
							className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-gray-200 cursor-pointer"
							onClick={() => handleTransferWorkspaceOwnership(member._id)}
						>
							<Avatar>
								<AvatarImage src={member?.user?.avatar} />
								<AvatarFallback>
									{member?.user?.fullname?.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<small className="capitalize font-medium">
									{member?.user?.fullname}
								</small>
								<small className=" font-medium">{member?.user?.email}</small>
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default TransferWorkspace;
