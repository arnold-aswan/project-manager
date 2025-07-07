import CreateTaskDialog from "@/components/modals/CreateTask";
import BackButton from "@/components/shared/back-button";
import Loader from "@/components/shared/loader";
import TaskColumn from "@/components/tasks/TaskColumn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProjectsQuery } from "@/hooks/useProjects";
import { getProjectProgress } from "@/lib";
import type { Project, Task, TaskStatusFilter } from "@/types";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

const ProjectDetails = () => {
	const { projectId, workspaceId } = useParams<{
		projectId: string;
		workspaceId: string;
	}>();
	const navigate = useNavigate();

	const [isCreateTask, setIsCreateTask] = useState(false);
	const [taskFilter, setTaskFilter] = useState<TaskStatusFilter | "All">("All");

	if (!projectId && workspaceId) return <div>No project found!</div>;

	const { data, isPending } = useGetProjectsQuery(projectId!) as {
		data: { project: Project; tasks: Task[] };
		isPending: boolean;
	};

	const projectProgress = getProjectProgress(
		(data?.tasks || []).map((task) => ({
			status: task.status as TaskStatusFilter,
		}))
	);

	const handleTaskClick = (taskId: string) => {
		navigate(
			`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
		);
	};

	const statuses = ["To Do", "In Progress", "Done"];
	const taskFilters = [
		{ value: "all", label: "All Tasks", status: "All" },
		{ value: "todo", label: "To Do", status: "To Do" },
		{ value: "in-progress", label: "In Progress", status: "In Progress" },
		{ value: "done", label: "Done", status: "Done" },
	];

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

					<Button onClick={() => setIsCreateTask(true)}>Create Task</Button>
				</div>
			</header>

			<div className="flex items-center justify-between">
				<Tabs
					defaultValue="all"
					className="w-full"
				>
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
						<TabsList>
							{taskFilters.map(({ value, label, status }) => (
								<TabsTrigger
									key={value}
									value={value}
									onClick={() =>
										setTaskFilter(status as TaskStatusFilter | "All")
									}
								>
									{label}
								</TabsTrigger>
							))}
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
						value="all"
						className="m-0"
					>
						<div className="grid grid-cols-3 gap-4">
							<TaskColumn
								title="To Do"
								tasks={data?.tasks.filter((task) => task.status === "To Do")}
								onTaskClick={handleTaskClick}
							/>

							<TaskColumn
								title="In Progress"
								tasks={data?.tasks.filter(
									(task) => task.status === "In Progress"
								)}
								onTaskClick={handleTaskClick}
							/>

							<TaskColumn
								title="Done"
								tasks={data?.tasks.filter((task) => task.status === "Done")}
								onTaskClick={handleTaskClick}
							/>
						</div>
					</TabsContent>

					<TabsContent
						value="todo"
						className="m-0"
					>
						<div className="grid grid-cols-3 gap-4">
							<TaskColumn
								title="To Do"
								tasks={data?.tasks.filter((task) => task.status === "To Do")}
								onTaskClick={handleTaskClick}
							/>
						</div>
					</TabsContent>

					<TabsContent
						value="in-progress"
						className="m-0"
					>
						<div className="grid grid-cols-3 gap-4">
							<TaskColumn
								title="In Progress"
								tasks={data?.tasks.filter(
									(task) => task.status === "In Progress"
								)}
								onTaskClick={handleTaskClick}
							/>
						</div>
					</TabsContent>

					<TabsContent
						value="done"
						className="m-0"
					>
						<div className="grid grid-cols-3 gap-4">
							<TaskColumn
								title="Done"
								tasks={data?.tasks.filter((task) => task.status === "Done")}
								onTaskClick={handleTaskClick}
							/>
						</div>
					</TabsContent>
				</Tabs>
			</div>

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
