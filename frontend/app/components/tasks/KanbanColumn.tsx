import { useDroppable } from "@dnd-kit/core";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { borderColor } from "@/lib";

const KanbanColumn = ({
	id,
	title,
	children,
}: {
	id: string;
	title: string;
	children: any;
}) => {
	const { isOver, setNodeRef, active } = useDroppable({
		id,
	});

	return (
		<div
			ref={setNodeRef}
			className="flex flex-col p-2 pb-8 border w-full md:w-full md:max-w-[350px] xl:max-w-full rounded-lg"
		>
			<div className="py-3 w-full">
				<div className="w-full flex justify-between">
					<div className="w-full flex items-center justify-between gap-2">
						<p
							className={cn(
								borderColor(title),
								"border-l-4 rounded pl-2 text-base font-medium capitalize "
							)}
						>
							{title}
						</p>
						<Badge variant={"outline"}>{children?.length}</Badge>
					</div>
				</div>
			</div>
			<div
				className={`flex flex-1 ${
					active ? "overflow-[unset]" : "overflow-auto"
				} border border-dashed ${
					isOver ? " bg-violet-300/30" : "border-transparent"
				} rounded-sm `}
			>
				<div className="flex flex-col gap-4 w-full">{children}</div>
			</div>
		</div>
	);
};

export default KanbanColumn;
