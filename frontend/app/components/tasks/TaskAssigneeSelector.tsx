import type { ProjectMemberRole, Task, User } from "@/types";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useUpdateTaskAssigneesMutation } from "@/hooks/useTasks";
import { toast } from "sonner";
import { Loader2 } from "@/assets/icons";

const TaskAssigneeSelector = ({
	task,
	projectMembers,
}: {
	task: Task;
	projectMembers: { user: User; role: ProjectMemberRole }[];
}) => {
	const [selectedIds, setSelectedIds] = useState<string[]>(
		task?.assignees?.map((assignee) => assignee._id)
	);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const { mutate, isPending } = useUpdateTaskAssigneesMutation();

	const handleSelectAll = () => {
		const allIds = projectMembers?.map((member) => member?.user?._id);
		setSelectedIds(allIds);
	};

	const handleUnSelectAll = () => {
		setSelectedIds([]);
	};

	const handleSelect = (id: string) => {
		let newlySelectedIds: string[] = [];

		if (selectedIds.includes(id)) {
			newlySelectedIds = selectedIds.filter((sid) => sid !== id);
		} else {
			newlySelectedIds = [...selectedIds, id];
		}

		setSelectedIds(newlySelectedIds);
	};

	const handleSave = () => {
		mutate(
			{ taskId: task._id, assignees: selectedIds },
			{
				onSuccess: () => {
					setDropdownOpen(false);
					toast.success("Assignees updated successfully");
				},
				onError: (error: any) => {
					toast.error("Failed to update assignees");
					console.error(error);
				},
			}
		);
	};

	return (
		<div className="mb-6 ">
			<h3 className="text-sm font-medium to-muted-foreground mb-2">
				Assignees
			</h3>

			<div className="flex flex-wrap gap-2 mb-2">
				{selectedIds.length === 0 ? (
					<span className="text-xs to-muted-foreground">Unassigned</span>
				) : (
					projectMembers
						?.filter((member) => selectedIds?.includes(member?.user?._id))
						.map((m) => (
							<div
								key={m.user?._id}
								className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1"
							>
								<Avatar className="border flex items-center justify-center">
									<AvatarImage
										src={m.user.avatar}
										alt="avatar"
									/>
									<AvatarFallback className="size-6">
										{m.user.fullname.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span className="capitalize text-xs to-muted-foreground">
									{m.user.fullname}
								</span>
							</div>
						))
				)}
			</div>

			{/* dropdown */}
			<div className="relative">
				<button
					className="text-sm w-full border rounded -px-3 py-2 text-left bg-white pl-2"
					onClick={() => setDropdownOpen(!dropdownOpen)}
				>
					{selectedIds.length === 0
						? "Selected assignees"
						: `${selectedIds.length} selected`}
				</button>

				{dropdownOpen && (
					<div className="absolute z-10 mt-1 w-fit bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
						<div className="flex justify-between px-2 py-1 border-b">
							<button
								className="text-xs text-blue-600"
								onClick={handleSelectAll}
							>
								Select all
							</button>
						</div>

						<div className="flex justify-between px-2 py-1 border-b">
							<button
								className="text-xs text-red-600"
								onClick={handleUnSelectAll}
							>
								Unselect all
							</button>
						</div>

						{projectMembers?.map((member) => (
							<label
								htmlFor="project-member"
								className="flex items-center gap-2 px-3 psy-2 cursor-pointer hover:bg-gray-50"
								key={member?.user?._id}
							>
								<Checkbox
									id="project-member"
									checked={selectedIds.includes(member?.user?._id)}
									onCheckedChange={() => handleSelect(member?.user?._id)}
									className="mr-2"
								/>

								<Avatar className="size-6">
									<AvatarImage
										src={member?.user?.avatar}
										alt="avatar"
									/>
									<AvatarFallback>
										{member.user.fullname.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>

								<span className="capitalize text-xs to-muted-foreground">
									{member?.user?.fullname}
								</span>
							</label>
						))}
						<div className="flex justify-between px-2 py-1">
							<Button
								variant={"outline"}
								size={"sm"}
								// className="font-light"
								onClick={() => setDropdownOpen(false)}
								disabled={isPending}
							>
								Cancel
							</Button>

							<Button
								size={"sm"}
								// className="font-light "
								onClick={() => handleSave()}
								disabled={isPending}
							>
								{isPending ? (
									<>
										<Loader2 className="size-4 mr-2" /> Saving...
									</>
								) : (
									"Save"
								)}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TaskAssigneeSelector;
