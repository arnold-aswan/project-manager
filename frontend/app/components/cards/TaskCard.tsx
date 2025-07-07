import React from "react";
import type { Task } from "@/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Calendar, CheckCircle, Clock, CircleAlert } from "@/assets/icons";
import { dateFormatter, getTaskPriorityColor } from "@/lib";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
	return (
		<Card
			onClick={onClick}
			className="cursor-pointer hover:shadow-md transition-all duration-300 hover:translate-y-1 "
		>
			<CardHeader>
				<article className="flex items-center justify-between">
					<Badge className={cn(getTaskPriorityColor(task?.priority))}>
						{task?.priority}
					</Badge>

					<div className="flex gap-1">
						{task.status !== "To Do" && (
							<Button
								variant={"ghost"}
								size={"icon"}
								className="size-6"
								onClick={() => {
									console.log("mark as to do");
								}}
								title="Mark as To Do"
							>
								<CircleAlert className="size-4" />
								<span className="sr-only">Mark as To Do</span>
							</Button>
						)}
						{task.status !== "In Progress" && (
							<Button
								variant={"ghost"}
								size={"icon"}
								className="size-6"
								onClick={() => {
									console.log("mark as in progress");
								}}
								title="Mark as In Progress"
							>
								<Clock className="size-4" />
								<span className="sr-only">Mark as In Progress</span>
							</Button>
						)}
						{task.status !== "Done" && (
							<Button
								variant={"ghost"}
								size={"icon"}
								className="size-6"
								onClick={() => {
									console.log("mark as done");
								}}
								title="Mark as Done"
							>
								<CheckCircle className="size-4" />
								<span className="sr-only">Mark as Done</span>
							</Button>
						)}
					</div>
				</article>
			</CardHeader>

			<CardContent>
				<h4 className="font-medium mb-2">{task?.title}</h4>

				{task?.description && (
					<p className="text-sm text-muted-foreground line-clamp-2 mb-2">
						{task?.description}
					</p>
				)}

				<article className="flex items-center justify-between text-sm ">
					<div className="flex items-center gap-2">
						{task?.assignees && task.assignees.length > 0 && (
							<div className="flex space-x-2">
								{task?.assignees?.slice(0, 5).map((member) => (
									<Avatar
										key={member._id}
										className="relative size-8 bg-gray-700 rounded-full border-2 border-background overflow-hidden "
										title={member.fullname}
									>
										<AvatarImage
											src={member.avatar}
											alt={"avatar"}
										/>
										<AvatarFallback>
											{member.fullname.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
								))}

								{task.assignees.length > 5 && (
									<span className="text-xs to-muted-foreground ">
										+ {task.assignees.length - 5} others
									</span>
								)}
							</div>
						)}
					</div>
				</article>

				{task.dueDate && (
					<div className="text-xs to-muted-foreground flex items-center mt-1">
						<Calendar className="size-4 mr-1" />
						<span>{dateFormatter(task.dueDate)}</span>
					</div>
				)}

				{task?.subTasks && task.subTasks.length > 0 && (
					<div className="mt-2 text-xs text-muted-foreground">
						{task.subTasks.filter((subtask) => subtask.completed).length} /{" "}
						{task.subTasks.length} subtasks
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default TaskCard;
