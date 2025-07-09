import { useUpdateTaskPriorityMutation } from "@/hooks/useTasks";
import type { TaskPriority } from "@/types";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const TaskPrioritySelector = ({
	priority,
	taskId,
}: {
	priority: TaskPriority;
	taskId: string;
}) => {
	const { mutate, isPending } = useUpdateTaskPriorityMutation();

	const handlePriorityChange = (value: string) => {
		mutate(
			{ taskId, priority: value as TaskPriority },
			{
				onSuccess: (data: any) => {
					toast.success(data?.message || "Task priority updated successfully");
				},
				onError: (error: any) => {
					toast.error("Failed to update task priority.");
					console.error(error);
				},
			}
		);
	};

	return (
		<Select
			value={priority || ""}
			onValueChange={handlePriorityChange}
		>
			<SelectTrigger
				className="w-[180px]"
				disabled={isPending}
			>
				<SelectValue placeholder="Priority" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="Low">Low</SelectItem>
				<SelectItem value="Medium">Medium</SelectItem>
				<SelectItem value="High">High</SelectItem>
			</SelectContent>
		</Select>
	);
};

export default TaskPrioritySelector;
