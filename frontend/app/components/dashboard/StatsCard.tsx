import type { StatsCardProps } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const StatsCard = ({ stats }: { stats: StatsCardProps }) => {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium"> Total Projects</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">{stats.totalProjects}</p>
					<p className="text-xs text-muted-foreground">
						{stats.totalProjectInProgress || 0} in progress
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">{stats.totalTasks}</p>
					<p className="text-xs text-muted-foreground">
						{stats.totalTaskCompleted} completed
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">To Do</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">{stats.totalTaskToDo || 0}</p>
					<p className="text-xs text-muted-foreground">
						Tasks waiting to be done
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">In Progress</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">{stats.totalTaskInProgress || 0}</p>
					<p className="text-xs text-muted-foreground">
						Tasks currently in progress
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default StatsCard;
