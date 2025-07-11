import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Project, TaskStatusFilter } from "@/types";
import { Link, useSearchParams } from "react-router";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import { getProjectProgress, statusColor } from "@/lib";

const RecentProjects = ({ data }: { data: Project[] }) => {
	const [searchParams] = useSearchParams();
	const workspaceId = searchParams.get("workspaceId");
	return (
		<Card className="lg:col-spa-2">
			<CardHeader>
				<CardTitle>Recent Projects</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				{data.length === 0 ? (
					<p className="text-center text-muted-foreground py-8">
						No Recent project yet
					</p>
				) : (
					data.map((project) => {
						const projectProgress = getProjectProgress(
							(project.tasks || []).map((task) => ({
								status: task.status as TaskStatusFilter,
							}))
						);

						return (
							<div
								key={project._id}
								className="border rounded-lg p-4"
							>
								<div className="flex items-center justify-between mb-2">
									<Link
										to={`/workspaces${workspaceId}/projects/${project._id}`}
									>
										<h3 className="font-medium hover:text-primary transition-colors">
											{project.title}
										</h3>
									</Link>

									<span
										className={cn(
											"px-2 py-1 text-xs rounded-full",
											statusColor(project.status)
										)}
									>
										{project.status}
									</span>
								</div>
								<p className="text-sm text-muted-foreground mb-3 line-clamp-3">
									{project.description}
								</p>
								<div className="space-y-1">
									<div className="flex items-center justify-between text-xs">
										<span>Progress</span>
										<span>{projectProgress}%</span>
									</div>

									<Progress
										value={projectProgress}
										className="h-2"
									/>
								</div>
							</div>
						);
					})
				)}
			</CardContent>
		</Card>
	);
};

export default RecentProjects;
