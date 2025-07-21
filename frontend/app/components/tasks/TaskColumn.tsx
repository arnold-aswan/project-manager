import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { Badge } from "../ui/badge";
import TaskCard from "../cards/TaskCard";

interface TaskColumnProps {
	id: string;
	title: string;
	tasks: Task[];
	onTaskClick: (taskId: string) => void;
	isFullWidth?: boolean;
}

const TaskColumn = ({
	id,
	title,
	tasks,
	onTaskClick,
	isFullWidth,
}: TaskColumnProps) => {
	return (
		<div
			className={`${
				isFullWidth
					? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
					: ""
			}`}
		>
			<div
				className={cn(
					"space-y-4",
					!isFullWidth ? "h-full" : "col-span-full mb-4"
				)}
			>
				{!isFullWidth && (
					<div className="flex items-center justify-between">
						<h1 className="font-medium">{title}</h1>
						<Badge variant={"outline"}>{tasks?.length}</Badge>
					</div>
				)}
				<div
					className={cn(
						"space-y-3",
						isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4"
					)}
				>
					{tasks?.length === 0 ? (
						<p className="text-center text-sm to-muted-foreground ">
							No tasks yet.
						</p>
					) : (
						tasks?.map((task) => (
							<TaskCard
								key={task._id}
								task={task}
								onClick={() => onTaskClick(task._id)}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default TaskColumn;
