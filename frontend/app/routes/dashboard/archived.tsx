import Loader from "@/components/shared/loader";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useArchiveProjectMutation,
	useGetArchivedProjectsAndTasksQuery,
} from "@/hooks/useProjects";
import type { Project, Task } from "@/types";
import { format } from "date-fns";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

const Archived = () => {
	const [searchParams] = useSearchParams();
	const workspaceId = searchParams.get("workspaceId");

	if (!workspaceId) return <div>No workspace selected.</div>;

	const { data: archivedData, isPending } = useGetArchivedProjectsAndTasksQuery(
		workspaceId!
	) as {
		data: {
			archivedProjects: Project[];
			archivedTasks: Task[];
		};
		isPending: boolean;
	};
	const { mutate: archiveTaskMutate, isPending: isArchiving } =
		useArchiveProjectMutation();

	const handleArchive = (projectId: string) => {
		archiveTaskMutate(
			{ projectId },
			{
				onSuccess: (data: any) => {
					toast.success(data.message);
				},
				onError: (error: any) => {
					toast.error("Failed to unarchive task.");
					console.error(error);
				},
			}
		);
	};

	if (isPending) return <Loader />;

	return (
		<section className="space-y-8 container ">
			<div className="space-y-8">
				<h3 className="text-xl font-bold">Archived Projects</h3>
			</div>

			<Table>
				<TableCaption>A list of your archived projects.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Progress</TableHead>
						<TableHead>Updated At</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{archivedData?.archivedProjects?.map((data) => (
						<TableRow key={data?._id}>
							<TableCell className="">{data.title}</TableCell>
							<TableCell className="">{data.status}</TableCell>
							<TableCell className="">{Number(data.progress)}</TableCell>
							<TableCell className="">
								{data.updatedAt
									? format(new Date(data.updatedAt), "PPP")
									: "N/A"}
							</TableCell>
							<TableCell>
								<Button
									variant={"outline"}
									size={"sm"}
									onClick={() => handleArchive(data._id)}
									className="w-fit"
									disabled={isArchiving}
								>
									{data?.isArchived ? "Unarchive" : "Archive"}
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<div className="space-y-8">
				<h3 className="text-xl font-bold">Archived Tasks</h3>
			</div>

			<Table>
				<TableCaption>A list of your archived tasks.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Priority</TableHead>
						<TableHead>Project</TableHead>
						<TableHead>Updated At</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{archivedData?.archivedTasks?.map((data) => (
						<TableRow key={data?._id}>
							<TableCell className="">{data.title}</TableCell>
							<TableCell className="">{data.status}</TableCell>
							<TableCell className="">{data.priority}</TableCell>
							<TableCell className="">{data.project.title}</TableCell>
							<TableCell className="">
								{format(data.updatedAt, "PPP")}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</section>
	);
};

export default Archived;
