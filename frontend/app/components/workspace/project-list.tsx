import React from "react";
import type { Project } from "@/types";
import NoDataFound from "../no-data-found";
import ProjectCard from "../cards/ProjectCard";

interface ProjectListProps {
	workspaceId: string;
	projects: Project[];
	onCreateProject: () => void;
}

const ProjectList = ({
	workspaceId,
	projects,
	onCreateProject,
}: ProjectListProps) => {
	return (
		<section>
			<h3 className="text-xl font-medium mb-4">Projects</h3>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{projects.length < 1 ? (
					<NoDataFound
						title="No projects found."
						description="Create a new project to get started."
						buttonText="Create new project"
						buttonAction={onCreateProject}
					/>
				) : (
					projects.map((project) => {
						const projectProgress = 0;
						return (
							<ProjectCard
								key={project._id}
								project={project}
								progress={projectProgress}
								workspaceId={workspaceId}
							/>
						);
					})
				)}
			</div>
		</section>
	);
};

export default ProjectList;
