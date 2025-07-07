import BackButton from "@/components/shared/back-button";
import Loader from "@/components/shared/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetTaskByIdQuery } from "@/hooks/useTasks";
import useAuthStore from "@/stores/authstore";
import type { Project, Task } from "@/types";
import React from "react";
import { useParams } from "react-router";
import { Eye, EyeOff } from "@/assets/icons";
import { getTaskPriorityVariant } from "@/lib";
import TaskTitle from "@/components/tasks/TaskTitle";

const TaskDetails = () => {
	const { projectId, taskId, workspaceId } = useParams<{
		projectId: string;
		taskId: string;
		workspaceId: string;
	}>();

	if (!projectId || !taskId || !workspaceId) {
		return <div>No task found!</div>;
	}

	const { user } = useAuthStore.getState();

	const { data, isPending } = useGetTaskByIdQuery(taskId!) as {
		data: { task: Task; project: Project };
		isPending: boolean;
	};

	console.log(data);

	const isUserWatching = data?.task?.watchers?.some(
		(watcher) => String(watcher._id) === String(user?._id)
	);
	const members = data?.task?.assignees || [];

	if (isPending) return <Loader />;
	if (!data) {
		return <div>No task found!</div>;
	}

	return (
		<section className="container mx-auto p-0 py-4 md:px-4 ">
			<header className="flex flex-col md:flex-row items-center justify-between mb-6 ">
				<div className="flex flex-col md:flex-row md:items-center">
					<BackButton />
					<h1 className="text-xl md:text-2xl font-bold">{data?.task?.title}</h1>

					{data?.task?.isArchived && (
						<Badge
							variant="outline"
							className="ml-2"
						>
							Achieved
						</Badge>
					)}
				</div>

				<div className="flex space-x-2 mt-4 md:mt-0">
					<Button
						variant={"outline"}
						size={"sm"}
						onClick={() => {}}
						className="w-fit"
					>
						{isUserWatching ? (
							<>
								<EyeOff className="mr-2 size-4 " />
								Unwatch
							</>
						) : (
							<>
								<Eye className="mr-2 size-4" />
								watch
							</>
						)}
					</Button>

					<Button
						variant={"outline"}
						size={"sm"}
						onClick={() => {}}
						className="w-fit"
					>
						{data?.task?.isArchived ? "Unarchive" : "Archive"}
					</Button>
				</div>
			</header>

			<div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="lg:col-span-2">
					<div className="bg-card rounded-lg p-6 shadow-sm mb-6 ">
						<div className="flex flex-col md:flex-row justify-between items-start mb-4">
							<div>
								<Badge
									variant={getTaskPriorityVariant(data?.task?.priority)}
									className="mb-2 capitalize"
								>
									{data?.task?.priority} Priority
								</Badge>

								<TaskTitle
									title={data?.task?.title}
									taskId={taskId}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TaskDetails;
