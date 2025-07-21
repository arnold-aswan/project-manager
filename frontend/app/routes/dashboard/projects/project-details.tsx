import CreateTaskDialog from "@/components/modals/CreateTask";
import BackButton from "@/components/shared/back-button";
import Loader from "@/components/shared/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useArchiveProjectMutation,
	useGetProjectsQuery,
} from "@/hooks/useProjects";
import {
	getProjectProgress,
	getTaskPriorityColor,
	taskStatusColor,
} from "@/lib";
import type { Project, Task, TaskStatusFilter } from "@/types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

import Kanban from "@/components/tasks/Kanban";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Eye } from "@/assets/icons";

const ProjectDetails = () => {
	const { projectId, workspaceId } = useParams<{
		projectId: string;
		workspaceId: string;
	}>();
	if (!projectId && workspaceId) return <div>No project found!</div>;

	const [isCreateTask, setIsCreateTask] = useState(false);
	const [kanbanTasks, setKanbanTasks] = useState<Task[]>([]);

	const { data, isPending } = useGetProjectsQuery(projectId!) as {
		data: { project: Project; tasks: Task[] };
		isPending: boolean;
	};

	const { mutate: archiveTaskMutate, isPending: isArchiving } =
		useArchiveProjectMutation();

	useEffect(() => {
		if (data?.tasks) {
			setKanbanTasks(data.tasks);
		}
	}, [data?.tasks]);

	const projectProgress = getProjectProgress(
		(data?.tasks || []).map((task) => ({
			status: task.status as TaskStatusFilter,
		}))
	);

	const statuses = ["To Do", "In Progress", "Done"];
	const taskFilters = [
		{ value: "todo", label: "To Do", status: "To Do" },
		{ value: "in-progress", label: "In Progress", status: "In Progress" },
		{ value: "done", label: "Done", status: "Done" },
	];

	const handleArchive = () => {
		archiveTaskMutate(
			{ projectId: projectId! },
			{
				onSuccess: (data: any) => {
					toast.success(data.message);
				},
				onError: (error: any) => {
					toast.error("Failed to archive task.");
					console.error(error);
				},
			}
		);
	};

	if (isPending) return <Loader />;
	if (!data || !data.project) {
		return <div>No project found!</div>;
	}

	return (
		<section className="space-y-8">
			<header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<BackButton />
					<div className="flex items-center gap-3">
						<h1 className="text-xl md:text-2xl font-bold">
							{data?.project?.title}
						</h1>
						{data?.project?.isArchived && (
							<Badge
								variant="outline"
								className="ml-2"
							>
								Achieved
							</Badge>
						)}
					</div>
					{data?.project?.description && (
						<p className="text-sm text-gray-500">
							{data?.project?.description}
						</p>
					)}
				</div>

				<div className="flex flex-col sm:flex-row gap-3">
					<div className="flex items-center gap-2 min-w-32">
						<p className="text-sm text-muted-foreground">Progress:</p>
						<div className="flex-1">
							<Progress
								value={projectProgress}
								className="h-2"
							/>
						</div>
						<span className="text-sm text-muted-foreground">
							{projectProgress}%
						</span>
					</div>

					<Button
						variant={"outline"}
						size={"sm"}
						onClick={handleArchive}
						className="w-fit"
						disabled={isArchiving}
					>
						{data?.project?.isArchived ? "Unarchive" : "Archive"}
					</Button>

					<Button onClick={() => setIsCreateTask(true)}>Create Task</Button>
				</div>
			</header>

			<main className="flex items-center justify-between">
				<Tabs
					defaultValue="table"
					className="w-full"
				>
					<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
						<TabsList>
							<TabsTrigger value="table">Table</TabsTrigger>
							<TabsTrigger value="kanban">Kanban</TabsTrigger>
						</TabsList>

						<div className="flex items-center text-sm">
							<span className="text-muted-foreground mr-2">Status:</span>
							<div className="space-x-2">
								{statuses.map((status) => {
									const count =
										data?.tasks.filter((task) => task.status === status)
											.length || 0;
									return (
										<Badge
											key={status}
											variant="outline"
											className="bg-background"
										>
											{count} {status}
										</Badge>
									);
								})}
							</div>
						</div>
					</div>

					<TabsContent
						value="table"
						className="w-full max-w-full"
					>
						<div className="w-full max-w-full overflow-x-auto -mx-0">
							{/* <div className="min-w-[640px] md:min-w-full border"> */}
							<Table className="min-w-[640px] w-max border-collapse">
								<TableCaption>A list of tasks.</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Priority</TableHead>
										<TableHead>Assignees</TableHead>
										<TableHead>Sub Tasks</TableHead>
										<TableHead>Due Date</TableHead>
										<TableHead>Created At</TableHead>
										<TableHead>Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data?.tasks?.map((task) => (
										<TableRow key={task._id}>
											<TableCell>{task.title}</TableCell>
											<TableCell>
												<Badge
													className={cn(
														taskStatusColor(task.status),
														"rounded-full"
													)}
												>
													{task.status}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													className={cn(
														getTaskPriorityColor(task.priority),
														"rounded-full"
													)}
												>
													{task.priority}
												</Badge>
											</TableCell>
											<TableCell>
												{task?.assignees?.slice(0, 3)?.map((a) => (
													<Avatar
														key={a._id}
														className="relative size-8 bg-gray-700 rounded-full border-2 border-background overflow-hidden "
														title={a.fullname}
													>
														<AvatarImage
															src={a.avatar}
															alt={"avatar"}
														/>
														<AvatarFallback>
															{a.fullname.charAt(0).toUpperCase()}
														</AvatarFallback>
													</Avatar>
												))}
											</TableCell>
											<TableCell>
												<Badge>{task.subTasks?.length}</Badge>
											</TableCell>
											<TableCell>{format(task.dueDate, "P")}</TableCell>
											<TableCell>{format(task.createdAt, "P")}</TableCell>
											<TableCell>
												<Button variant={"outline"}>
													<Link
														to={`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}`}
														className="flex items-center gap-1 "
													>
														<Eye />
														View Task
													</Link>
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
						{/* // </div> */}
					</TabsContent>

					<TabsContent value="kanban">
						<Kanban
							stages={taskFilters}
							tasks={kanbanTasks}
							projectId={projectId || ""}
							workspaceId={workspaceId || ""}
							setTasks={setKanbanTasks}
						/>
					</TabsContent>
				</Tabs>
			</main>

			{/* Add task modal */}
			<CreateTaskDialog
				open={isCreateTask}
				onOpenChange={setIsCreateTask}
				projectId={projectId!}
				projectMembers={data?.project.members as any}
			/>
		</section>
	);
};

export default ProjectDetails;
