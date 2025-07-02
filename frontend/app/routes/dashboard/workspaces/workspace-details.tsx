import React, { useState } from "react";
import { useParams } from "react-router";
import CreateProject from "@/components/modals/CreateProject";
import Loader from "@/components/shared/loader";
import WorkspaceHeader from "@/components/workspace-header";
import ProjectList from "@/components/workspace/project-list";
import { useGetWorkspaceQuery } from "@/hooks/useWorkspace";
import type { Project, Workspace } from "@/types";

const WorkspaceDetails = () => {
	const { workspaceId } = useParams<{ workspaceId: string }>();
	const [isCreateProject, setIsCreateProject] = useState(false);
	const [isInviteMember, setIsInviteMember] = useState(false);

	if (!workspaceId) return <div>No workspace found!</div>;

	const { data, isPending, isSuccess } = useGetWorkspaceQuery(workspaceId) as {
		data: { workspace: Workspace; projects: Project[] };
		isPending: boolean;
		isSuccess: boolean;
	};

	if (isPending) return <Loader />;
	console.log(data);

	return (
		<section className="space-y-8">
			{/* Header */}
			<WorkspaceHeader
				workspace={data?.workspace}
				members={data?.workspace?.members}
				onCreateProject={() => setIsCreateProject(true)}
				onInviteMember={() => setIsInviteMember(true)}
			/>

			{/* Projects list */}
			<ProjectList
				workspaceId={workspaceId}
				projects={data?.projects}
				onCreateProject={() => setIsCreateProject(true)}
			/>

			{/* Create project */}
			<CreateProject
				isOpen={isCreateProject}
				onOpenChange={setIsCreateProject}
				workspaceId={workspaceId}
				workspaceMembers={data?.workspace.members as any}
			/>
		</section>
	);
};

export default WorkspaceDetails;
