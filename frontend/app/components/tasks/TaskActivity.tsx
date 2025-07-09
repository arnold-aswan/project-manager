import { useTaskActivity } from "@/hooks/useTasks";
import { Loader2 } from "@/assets/icons";
import type { ActivityLog } from "@/types";
import { getActivityIcon } from "./TaskIcon";
import { ScrollArea } from "../ui/scroll-area";

const TaskActivity = ({ resourceId }: { resourceId: string }) => {
	const { data, isPending } = useTaskActivity(resourceId) as {
		data: ActivityLog[];
		isPending: boolean;
	};

	if (isPending)
		return (
			<div className="w-full flex items-center justify-center">
				<Loader2 className="size-10 text-blue-500 animate-spin " />
			</div>
		);

	return (
		<div className="bg-card rounded-lg p-6 shadow-sm">
			<h3 className="text-lg text-muted-foreground mb-4">Activity</h3>

			<ScrollArea className="max-h-[36rem] overflow-y-auto">
				<div className="space-y-3">
					{data?.map((activity) => (
						<div
							key={activity?._id}
							className="flex gap-2"
						>
							<div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
								{getActivityIcon(activity?.action)}
							</div>

							<div>
								<p className="text-sm">
									<span className="font-medium">
										{activity?.user?.fullname}
									</span>{" "}
									{activity?.details?.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
};

export default TaskActivity;
