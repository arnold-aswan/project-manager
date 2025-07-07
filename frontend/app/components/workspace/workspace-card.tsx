import React from "react";
import type { Workspace } from "@/types";
import { Link } from "react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import WorkspaceAvatar from "./workspace-avatar";
import { dateFormatter } from "@/lib";
import { Users } from "@/assets/icons";

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
	return (
		<Link to={`/workspaces/${workspace._id}`}>
			<Card className="transition-all hover:shadow-md hover:translate-y-1 ">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between ">
						<div className="flex gap-2">
							<WorkspaceAvatar
								name={workspace.name}
								color={workspace.color}
							/>

							<div>
								<CardTitle>{workspace.name}</CardTitle>
								<small className="text-muted-foreground">
									Created at {dateFormatter(workspace.createdAt)}
								</small>
							</div>
						</div>

						<div className="flex items-center gap-2 text-muted-foreground ">
							<Users size={16} />
							<span className="text-xs">{workspace.members.length}</span>
						</div>
					</div>

					<CardDescription>
						{workspace.description || "No description."}
					</CardDescription>
				</CardHeader>

				<CardContent>
					<p className="text-sm text-muted-foreground">
						View workspace details and projects.
					</p>
				</CardContent>
			</Card>
		</Link>
	);
};

export default WorkspaceCard;
