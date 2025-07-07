import { useUpdateTaskDescriptionMutation } from "@/hooks/useTasks";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Edit, Loader2 } from "@/assets/icons";
import { Textarea } from "../ui/textarea";

const TaskDescription = ({
	description,
	taskId,
}: {
	description: string;
	taskId: string;
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [newDescription, setNewDescription] = useState(description);

	const { mutate, isPending } = useUpdateTaskDescriptionMutation();

	const updateTitle = () => {
		if (newDescription.trim().length < 4) {
			toast.error("Title must be at least 4 characters long.");
			return;
		}

		if (newDescription.trim() === description.trim()) {
			setIsEditing(false);
			return; // No change, so skip update
		}
		mutate(
			{ taskId, description: newDescription },
			{
				onSuccess: (data: any) => {
					setIsEditing(false);
					toast.success("Task description updated successfully!");
				},
				onError: (error: any) => {
					setIsEditing(false);
					const errorMsg = error?.response?.data?.message;
					toast.error("Failed to update task title");
					console.log(errorMsg);
				},
			}
		);
	};

	return (
		<div className="flex items-center gap-2">
			{isEditing ? (
				<Textarea
					value={newDescription}
					onChange={(e) => setNewDescription(e.target.value)}
					disabled={isPending}
					className=" w-full"
				/>
			) : (
				<p className="text-base text-pretty flex-1 to-muted-foreground">
					{description}
				</p>
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

export default TaskDescription;
