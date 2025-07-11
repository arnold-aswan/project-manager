import { Request, Response } from "express";
import Workspace from "../models/workspace";
import Project from "../models/projects";

export interface UserWithId {
	userId: string;
	// add other properties if needed
}

export const getUser = async (
	req: Request,
	res: Response
): Promise<UserWithId | undefined> => {
	const user = req.user as UserWithId | undefined;

	if (!user || !user.userId) {
		res.status(401).json({ message: "Unauthorized: User not found" });
		return undefined;
	}
	return user;
};

const createWorkspace = async (req: Request, res: Response) => {
	try {
		const { name, description, color } = req.body;

		const user = await getUser(req, res);
		if (!user) return;

		const workspace = await Workspace.create({
			name,
			description,
			color,
			owner: user.userId,
			members: [
				{
					user: user.userId,
					role: "owner",
					joinedAt: Date.now(),
				},
			],
		});

		res
			.status(201)
			.json({ message: "workspace created successfully", workspace });
		return;
	} catch (error) {
		console.error("Error creating workspace::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const getWorkspaces = async (req: Request, res: Response) => {
	try {
		// get workspaces where user is a member of
		const user = await getUser(req, res);
		if (!user) return;
		const workspaces = await Workspace.find({
			"members.user": user.userId,
		}).sort({ createdAt: -1 });

		res.status(200).json(workspaces);
		return;
	} catch (error) {
		console.error("Error fetching workspaces::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};
const getWorkspaceDetails = async (req: Request, res: Response) => {
	try {
		const user = await getUser(req, res);
		if (!user) return;

		// ** get workspace id
		const { workspaceId } = req.params;
		// ** find workspace by id
		const workspace = await Workspace.findOne({
			_id: workspaceId,
			"members.user": user.userId,
		}).populate("members.user", "fullname email avatar");

		if (!workspace) {
			res.status(404).json({ message: "Workspace not found." });
			return;
		}

		res.status(200).json(workspace);
	} catch (error) {
		console.error("Error fetching workspace::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const getWorkspaceProjects = async (req: Request, res: Response) => {
	try {
		const user = await getUser(req, res);
		if (!user) return;

		// ** get workspace id
		const { workspaceId } = req.params;
		// ** find workspace by id
		const workspace = await Workspace.findOne({
			_id: workspaceId,
			"members.user": user.userId,
		}).populate("members.user", "fullname email avatar");

		if (!workspace) {
			res.status(404).json({ message: "No workspace found" });
			return;
		}

		const projects = await Project.find({
			workspace: workspaceId,
			isArchived: false,
			"members.user": user.userId,
		})
			.populate("status") // TODO "tasks" goes here
			.sort({ createdAt: -1 });

		res.status(200).json({ projects, workspace });
	} catch (error) {
		console.error("Error fetching workspace projects::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const getWorkspaceStats = async (req: Request, res: Response) => {
	try {
		const { workspaceId } = req.params;

		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			res.status(404).json({ message: "Workspace not found." });
			return;
		}

		const user = await getUser(req, res);
		if (!user) return;

		const isMember = workspace.members.some(
			(member) => String(member.user) === String(user.userId)
		);
		if (!isMember) {
			res
				.status(403)
				.json({ message: "You are not a member of this workspace!" });
			return;
		}

		const [totalProjects, projects] = await Promise.all([
			Project.countDocuments({ workspace: workspaceId }),
			Project.find({ workspace: workspaceId })
				.populate("tasks", "title status dueDate project isArchived priority")
				.sort({ createdAt: -1 }),
		]);

		let totalTasks = 0;
		let totalTasksCompleted = 0;
		let totalTasksToDo = 0;
		let totalTasksInProgress = 0;
		let totalProjectsInProgress = 0;
		let tasks: any = [];

		projects.forEach((project) => {
			if (project.status?.toLowerCase() === "in progress") {
				totalProjectsInProgress++;
			}

			const projectTasks = project.tasks as any[];
			for (const task of projectTasks) {
				totalTasks++;
				tasks.push(task);

				const status = task.status?.toLowerCase();
				if (status === "done") totalTasksCompleted++;
				else if (status === "to do") totalTasksToDo++;
				else if (status === "in progress") totalTasksInProgress++;
			}
		});

		// get upcoming task in next 7 days

		const upcomingTasks = tasks.filter((task: any) => {
			const taskDate = new Date(task.dueDate);
			const today = new Date();
			return (
				taskDate > today &&
				taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
			);
		});

		const taskTrendsData = [
			{ name: "Sun", completed: 0, inProgress: 0, toDo: 0 },
			{ name: "Mon", completed: 0, inProgress: 0, toDo: 0 },
			{ name: "Tue", completed: 0, inProgress: 0, toDo: 0 },
			{ name: "Wed", completed: 0, inProgress: 0, toDo: 0 },
			{ name: "Thu", completed: 0, inProgress: 0, toDo: 0 },
			{ name: "Fri", completed: 0, inProgress: 0, toDo: 0 },
			{ name: "Sat", completed: 0, inProgress: 0, toDo: 0 },
		];

		// get last 7 days tasks date
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return date;
		}).reverse();

		// populate

		for (const project of projects) {
			for (const task of project.tasks as any[]) {
				const taskDate = new Date(task.updatedAt);

				const dayInDate = last7Days.findIndex(
					(date) =>
						date.getDate() === taskDate.getDate() &&
						date.getMonth() === taskDate.getMonth() &&
						date.getFullYear() === taskDate.getFullYear()
				);

				if (dayInDate !== -1) {
					const dayName = last7Days[dayInDate].toLocaleDateString("en-US", {
						weekday: "short",
					});

					const dayData = taskTrendsData.find((day) => day.name === dayName);

					if (dayData) {
						switch (task.status) {
							case "Done":
								dayData.completed++;
								break;
							case "In Progress":
								dayData.inProgress++;
								break;
							case "To Do":
								dayData.toDo++;
								break;
						}
					}
				}
			}
		}

		// get project status distribution
		const projectStatusData = [
			{ name: "Completed", value: 0, color: "#10b981" },
			{ name: "In Progress", value: 0, color: "#3b82f6" },
			{ name: "Planning", value: 0, color: "#f59e0b" },
		];

		for (const project of projects) {
			switch (project.status?.toLowerCase()) {
				case "completed":
					projectStatusData[0].value++;
					break;
				case "in progress":
					projectStatusData[1].value++;
					break;
				case "planning":
					projectStatusData[2].value++;
					break;
			}
		}

		// Task priority distribution
		const taskPriorityData = [
			{ name: "High", value: 0, color: "#ef4444" },
			{ name: "Medium", value: 0, color: "#f59e0b" },
			{ name: "Low", value: 0, color: "#6b7280" },
		];

		for (const task of tasks) {
			switch (task.priority.toLowerCase()) {
				case "high":
					taskPriorityData[0].value++;
					break;
				case "medium":
					taskPriorityData[1].value++;
					break;
				case "low":
					taskPriorityData[2].value++;
					break;
			}
		}

		const workspaceProductivityData = [];

		for (const project of projects) {
			const projectTask = tasks.filter(
				(task: any) => task.project.toString() === project._id.toString()
			);

			const completedTask = projectTask.filter(
				(task: any) => task.status === "Done" && task.isArchived === false
			);

			workspaceProductivityData.push({
				name: project.title,
				completed: completedTask.length,
				total: projectTask.length,
			});
		}

		const stats = {
			totalProjects,
			totalTasks,
			totalProjectsInProgress,
			totalTasksCompleted,
			totalTasksToDo,
			totalTasksInProgress,
		};

		res.status(200).json({
			stats,
			taskTrendsData,
			projectStatusData,
			taskPriorityData,
			workspaceProductivityData,
			upcomingTasks,
			recentProjects: projects.slice(0, 5),
		});
		return;
	} catch (error) {
		console.error("Error fetching workspace stats::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

export {
	createWorkspace,
	getWorkspaces,
	getWorkspaceDetails,
	getWorkspaceProjects,
	getWorkspaceStats,
};
