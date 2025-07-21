import type { Task } from "@/types";
import TaskCard from "../cards/TaskCard";

const KanbanCard = ({
	children,
	handleTaskClick,
}: {
	children: Task;
	handleTaskClick: (id: string) => void;
}) => {
	return (
		<TaskCard
			task={children}
			onClick={() => handleTaskClick(children._id)}
		/>
	);
};

export default KanbanCard;
