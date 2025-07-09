import { useState } from "react";
import type { SubTask } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
	useAddSubTaskMutation,
	useUpdateSubTaskMutation,
} from "@/hooks/useTasks";
import { toast } from "sonner";

const SubTaskDetails = ({
	subTasks,
	taskId,
}: {
	subTasks: SubTask[];
	taskId: string;
}) => {
	const [newSubTask, setNewSubTask] = useState("");
	const { mutate: addSubTask, isPending } = useAddSubTaskMutation();
	const { mutate: updateSubTask, isPending: isUpdating } =
		useUpdateSubTaskMutation();

	const handleToggleTask = (subTaskId: string, checked: boolean) => {
		updateSubTask(
			{ taskId, subTaskId, completed: checked },
			{
				onSuccess: (data: any) => {
					toast.success(data.message);
				},
				onError: (error: any) => {
					toast.error("Failed to add new sub task.");
					console.error(error);
				},
			}
		);
	};

	const handleAddSubTask = () => {
		if (!newSubTask.trim() || newSubTask.length < 4) {
			toast.error("Sub task title must be more than 4 characters long.");
			return;
		}

		addSubTask(
			{ taskId, title: newSubTask },
			{
				onSuccess: (data: any) => {
					setNewSubTask("");
					toast.success(data.message);
				},
				onError: (error: any) => {
					toast.error("Failed to add new sub task.");
					console.error(error);
				},
			}
		);
	};
	return (
		<div className="my-6">
			<h3 className="text-sm text-muted-foreground font-medium ">Sub Tasks</h3>

			<div className="space-y-2 mb-1">
				{subTasks?.length > 0 ? (
					subTasks?.map((subTask) => (
						<div
							key={subTask?._id}
							className="flex items-center space-x-2 "
						>
							<Checkbox
								id={subTask?._id}
								checked={subTask?.completed}
								onCheckedChange={(checked) =>
									handleToggleTask(subTask?._id, !!checked)
								}
								disabled={isUpdating}
							/>

							<label
								htmlFor={subTask?._id}
								className={cn(
									"text-sm",
									subTask?.completed && "line-through to-muted-foreground"
								)}
							>
								{subTask?.title}
							</label>
						</div>
					))
				) : (
					<small className="tex-sm to-muted-foreground">No sub tasks.</small>
				)}
			</div>

			<div className="flex ">
				<Input
					placeholder="Create a sub task"
					value={newSubTask}
					onChange={(e) => setNewSubTask(e.target.value)}
					className="mr-1"
					disabled={isPending}
				/>

				<Button
					onClick={handleAddSubTask}
					disabled={isPending}
				>
					Add Sub task
				</Button>
			</div>
		</div>
	);
};

export default SubTaskDetails;
