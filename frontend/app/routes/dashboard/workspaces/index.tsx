import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateWorkspace from "@/components/workspace/create-workspace";
import { useGetWorkspaces } from "@/hooks/useWorkspace";
import { useLoaderData } from "react-router";
import Loader from "@/components/shared/loader";
import type { Workspace } from "@/types";
import WorkspaceCard from "@/components/workspace/workspace-card";
import { PlusCircle } from "@/assets/icons";
import NoDataFound from "@/components/no-data-found";

const Workspaces = () => {
	const { data: workspaces, isPending } = useGetWorkspaces() as {
		data: Workspace[];
		isPending: boolean;
	};
	const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

	if (isPending) return <Loader />;

	return (
		<section>
			<div className="space-y-8 ">
				<div className="flex items-center justify-between">
					<h2 className="text-xl md:text-3xl font-bold ">Workspaces</h2>

					<Button onClick={() => setIsCreatingWorkspace(true)}>
						<PlusCircle
							size={4}
							className="mr-2"
						/>
						New Workspace
					</Button>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
					{workspaces.length > 0 ? (
						workspaces.map((ws) => (
							<WorkspaceCard
								key={ws._id}
								workspace={ws}
							/>
						))
					) : (
						<NoDataFound
							title="No Workspaces Found"
							description="You have not created any workspaces yet."
							buttonText="Create Workspace"
							buttonAction={() => setIsCreatingWorkspace(true)}
						/>
					)}
				</div>
			</div>

			<CreateWorkspace
				isCreatingWorkspace={isCreatingWorkspace}
				setIsCreatingWorkspace={setIsCreatingWorkspace}
			/>
		</section>
	);
};

export default Workspaces;
