import RecentProjects from "@/components/dashboard/RecentProjects";
import StatsCard from "@/components/dashboard/StatsCard";
import StatsCharts from "@/components/dashboard/StatsChart";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";
import Loader from "@/components/shared/loader";
import { useGetWorkspaceStatsQuery } from "@/hooks/useWorkspace";
import type {
	Project,
	ProjectStatusData,
	StatsCardProps,
	Task,
	TaskPriorityData,
	TaskTrendsData,
	WorkspaceProductivityData,
} from "@/types";
import { useSearchParams } from "react-router";

const Dashboard = () => {
	const [searchParams] = useSearchParams();
	const workspaceId = searchParams.get("workspaceId");

	const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId!) as {
		data: {
			stats: StatsCardProps;
			taskTrendsData: TaskTrendsData[];
			projectStatusData: ProjectStatusData[];
			taskPriorityData: TaskPriorityData[];
			workspaceProductivityData: WorkspaceProductivityData[];
			upcomingTasks: Task[];
			recentProjects: Project[];
		};
		isPending: boolean;
	};

	if (isPending) return <Loader />;

	return (
		<section className="space-y-8 2xl:space-y-12">
			<h1 className="text-2xl font-bold">Dashboard</h1>

			<StatsCard stats={data.stats} />

			<StatsCharts
				stats={data.stats}
				taskTrendsData={data.taskTrendsData}
				projectStatusData={data.projectStatusData}
				taskPriorityData={data.taskPriorityData}
				workspaceProductivityData={data.workspaceProductivityData}
			/>

			<div className="grid gap-6 lg:grid-cols-2">
				<RecentProjects data={data.recentProjects} />
				<UpcomingTasks tasks={data.upcomingTasks} />
			</div>
		</section>
	);
};

export default Dashboard;
