import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit, Loader2 } from "@/assets/icons";
import { useUpdateTaskTitleMutation } from "@/hooks/useTasks";
import { toast } from "sonner";

const TaskTitle = ({ title, taskId }: { title: string; taskId: string }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [newTitle, setNewTitle] = useState(title);

	const { mutate, isPending } = useUpdateTaskTitleMutation();

	const updateTitle = () => {
		if (newTitle.trim().length < 4) {
			toast.error("Title must be at least 4 characters long.");
			return;
		}

		if (newTitle.trim() === title.trim()) {
			setIsEditing(false);
			return; // No change, so skip update
		}
		mutate(
			{ taskId, title: newTitle },
			{
				onSuccess: (data: any) => {
					setIsEditing(false);
					toast.success("Task title updated successfully!");
				},
				onError: (error: any) => {
					setIsEditing(false);
					const errorMsg = error?.response?.data?.message;
					toast.error("Failed to update task title");
				},
			}
		);
	};

	return (
		<div className="flex items-center gap-2">
			{isEditing ? (
				<Input
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
					disabled={isPending}
					className="text-xl font-semibold w-full"
				/>
			) : (
				<h2 className="text-lg flex-1 font-semibold">{title}</h2>
			)}

			{isEditing ? (
				<Button
					className="py-0"
					size={"sm"}
					onClick={updateTitle}
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
			) : (
				<Edit
					onClick={() => setIsEditing(true)}
					className="size-4 cursor-pointer"
				/>
			)}
		</div>
	);
};

export default TaskTitle;
