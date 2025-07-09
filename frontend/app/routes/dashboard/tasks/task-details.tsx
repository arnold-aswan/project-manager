import BackButton from "@/components/shared/back-button";
import Loader from "@/components/shared/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetTaskByIdQuery } from "@/hooks/useTasks";
import useAuthStore from "@/stores/authstore";
import type { Project, Task } from "@/types";
import { useParams } from "react-router";
import { Eye, EyeOff } from "@/assets/icons";
import { getTaskPriorityVariant } from "@/lib";
import TaskTitle from "@/components/tasks/TaskTitle";
import { formatDistanceToNow } from "date-fns";
import TaskStatusSelector from "@/components/tasks/TaskStatusSelector";
import TaskDescription from "@/components/tasks/TaskDescription";
import TaskAssigneeSelector from "@/components/tasks/TaskAssigneeSelector";
import TaskPrioritySelector from "@/components/tasks/TaskPrioritySelector";
import SubTaskDetails from "@/components/tasks/SubTaskDetails";
import CommentSection from "@/components/tasks/CommentSection";
import Watchers from "@/components/tasks/Watchers";
import TaskActivity from "@/components/tasks/TaskActivity";

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

			<main className="flex flex-col lg:flex-row gap-6">
				<div className="lg:basis-2/3 w-full">
					<div className="bg-card rounded-lg p-6 shadow-sm mb-6 ">
						<div className="flex flex-col md:flex-row justify-between items-start mb-4">
							<div>
								<Badge
									variant={getTaskPriorityVariant(data?.task?.priority)}
									className="mb-2 capitalize"
								>
									{data?.task?.priority} Priority
								</Badge>

								{/* task title */}
								<TaskTitle
									title={data?.task?.title}
									taskId={taskId}
								/>

								<div className="text-sm md:text-base to-muted-foreground">
									<p className="text-sm md:text-base to-muted-foreground">
										Created at:{" "}
										{formatDistanceToNow(new Date(data?.task?.createdAt), {
											addSuffix: true,
										})}
									</p>
								</div>
							</div>

							{/* task status */}
							<div className="flex items-center gap-2 mt-4 md:mt-0">
								<TaskStatusSelector
									status={data?.task?.status}
									taskId={data?.task?._id}
								/>

								<Button
									variant={"destructive"}
									size={"sm"}
									onClick={() => {}}
									className="hidden md:block"
								>
									Delete Task
								</Button>
							</div>
						</div>

						{/* task description */}
						<div className="mb-6">
							<h3 className="text-sm font-medium to-muted-foreground ">
								Description
							</h3>

							<TaskDescription
								description={data?.task?.description ?? ""}
								taskId={data?.task?._id}
							/>
						</div>

						{/* task assignees selector */}

						<TaskAssigneeSelector
							task={data?.task}
							projectMembers={data?.project?.members as any}
						/>

						<TaskPrioritySelector
							priority={data?.task?.priority}
							taskId={data?.task?._id}
						/>

						<SubTaskDetails
							subTasks={data?.task?.subTasks || []}
							taskId={data?.task?._id}
						/>
					</div>

					<CommentSection
						projectMembers={data?.project?.members as any}
						taskId={data?.task?._id}
					/>
				</div>

				<aside className="lg:basis-1/3 w-full">
					<Watchers watchers={data?.task?.watchers || []} />
					<TaskActivity resourceId={data?.task?._id} />
				</aside>
			</main>
		</section>
	);
};

export default TaskDetails;
