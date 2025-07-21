import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useMemo } from "react";
import KanbanColumn from "./KanbanColumn";
import KanbanItem from "./KanbanItem";
import KanbanCard from "./KanbanCard";
import type { Task } from "@/types";
import { useUpdateTaskStatusMutation } from "@/hooks/useTasks";
import { useNavigate } from "react-router";

const Kanban = ({
	stages,
	tasks,
	setTasks,
	projectId,
	workspaceId,
}: {
	stages: any;
	tasks: Task[];
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
	projectId: string;
	workspaceId: string;
}) => {
	const navigate = useNavigate();
	const { mutate: updateTaskStatus, isPending } = useUpdateTaskStatusMutation();

	const taskStages = useMemo(() => {
		if (!stages || !tasks) {
			return {
				unassignedStage: [],
				stages: [],
			};
		}

		const unassignedStage = tasks?.filter((task) => task.status === null);
		const grouped = stages.map((stage) => ({
			...stage,
			tasks: tasks.filter((task) => task.status === stage.status),
		}));

		return {
			unassignedStage,
			columns: grouped,
		};
	}, [tasks, stages]);

	const handleTaskClick = (taskId: string) => {
		navigate(
			`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
		);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!active || !over || active.id === over.id) return;

		// Get the new status based on the drop zone
		const newStatus = over.id === "unassigned" ? null : over.id;

		updateTaskStatus({
			taskId: String(active.id),
			status: String(newStatus),
		});

		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task._id === active.id // Compare task ID with active ID
					? {
							...task,
							status: newStatus,
					  }
					: task
			)
		);
	};

	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:gap-6 ">
				{taskStages.columns.map((column: any) => (
					<KanbanColumn
						key={column.value}
						id={column.status}
						title={column.label}
					>
						{column.tasks.map((task: Task) => (
							<KanbanItem
								key={task._id}
								id={task._id}
								data={task}
							>
								<KanbanCard handleTaskClick={handleTaskClick}>
									{task}
								</KanbanCard>
							</KanbanItem>
						))}
					</KanbanColumn>
				))}
			</div>
		</DndContext>
	);
};

export default Kanban;
