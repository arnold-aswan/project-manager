import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useUpdateTaskStatusMutation } from "@/hooks/useTasks";
import type { TaskStatus } from "@/types";
import { toast } from "sonner";

const TaskStatusSelector = ({
	status,
	taskId,
}: {
	status: string;
	taskId: string;
}) => {
	const { mutate, isPending } = useUpdateTaskStatusMutation();
	const handleStatusChange = (value: string) => {
		mutate(
			{ taskId, status: value as TaskStatus },
			{
				onSuccess: () => {
					toast.success("Status updated successfully");
				},
				onError: (error: any) => {
					toast.error("Failed to update status.");
					console.error(error);
				},
			}
		);
	};
	return (
		<Select
			value={status || ""}
			onValueChange={handleStatusChange}
		>
			<SelectTrigger
				className="w-[180px]"
				disabled={isPending}
			>
				<SelectValue placeholder="Status" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="To Do">To do</SelectItem>
				<SelectItem value="In Progress">In Progress</SelectItem>
				<SelectItem value="Done">Done</SelectItem>
			</SelectContent>
		</Select>
	);
};

export default TaskStatusSelector;
