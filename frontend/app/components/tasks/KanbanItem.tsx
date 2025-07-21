import type { Task } from "@/types";
import { DragOverlay, useDraggable } from "@dnd-kit/core";
import { GripHorizontal } from "lucide-react";

const KanbanItem = ({
	id,
	data,
	children,
}: {
	id: string;
	data: Task;
	children: any;
}) => {
	const { attributes, listeners, setNodeRef, active } = useDraggable({
		id,
		data,
	});
	return (
		<div className="relative">
			<div
				ref={setNodeRef}
				className={`${
					active
						? active.id === id
							? "opacity-[1]"
							: "opacity-[0.5]"
						: "opacity-[1]"
				} rounded-[8px] relative cursor-default`} // Remove grab cursor from entire card
			>
				<div className="border rounded-[8px] shadow-lg">
					{/* Content of the card */}
					<div className="flex-1">
						{/* Drag handle */}
						<div
							{...listeners} // Attach drag listeners to the handle
							{...attributes}
							className="cursor-grab p-1 hover:bg-gray-100 rounded transition-colors w-full "
							style={{ touchAction: "none" }}
						>
							<GripHorizontal className="h-4 w-4 text-gray-500" />
						</div>
						{children}
						{/* DragOverlay - Render the card during drag */}
						{active?.id === id && (
							<DragOverlay>
								<div className="w-full h-full rounded-[8px] shadow-xl cursor-grab">
									{children}
								</div>
							</DragOverlay>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default KanbanItem;
