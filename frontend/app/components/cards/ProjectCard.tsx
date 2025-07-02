import React from "react";
import type { ProjectCardProps } from "@/types";
import { Link } from "react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { dateFormatter, statusColor } from "@/lib";
import { Progress } from "../ui/progress";
import { Calendar } from "@/assets/icons";

const ProjectCard = ({ project, progress, workspaceId }: ProjectCardProps) => {
	console.log(project, progress);
	return (
		<Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
			<Card className="transition-all duration-300 hover:shadow-md hover:translate-y-1">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm">{project.title}</CardTitle>
						<small className={(cn("text-xs"), statusColor(project.status))}>
							{project.status}
						</small>
					</div>
					<CardDescription className="line-clamp-2">
						{project.description || "No description provided"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4 ">
						<div className="space-y-1">
							<div className="flex justify-between text-xs">
								<span>Progress</span>
								<span>{`${progress}%`}</span>
							</div>

							<Progress
								value={Number(progress)}
								className="h-2"
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center text-sm gap-2 text-muted-foreground">
								<span>{project?.tasks?.length}</span>
								<span>Tasks</span>
							</div>

							{project.dueDate && (
								<div className="flex items-center text-xs text-muted-foreground">
									<Calendar className="size-4 mr-1" />
									<span>{dateFormatter(project.dueDate)}</span>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default ProjectCard;
