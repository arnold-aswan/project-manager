import { Request, Response } from "express";
import Workspace from "../models/workspace";
import Project from "../models/projects";
import User from "../models/user";
import WorkspaceInvite from "../models/workspace-invite";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../libs/send-email";
import { logActivity } from "../libs";

dotenv.config();

type InviteMemberParams = {
	workspaceId: string;
};

type InviteMemberBody = {
	email: string;
	role: "admin" | "member" | "viewer";
};

export interface UserWithId {
	userId: string;
	// add other properties if needed
}
const jwtSecret = process.env.JWT_SECRET;

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
		}).populate("members.user", "fullname email avatar");

		if (!workspace) {
			res.status(404).json({ message: "Workspace not found." });
			return;
		}

		res.status(200).json(workspace);
		return;
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
				.populate(
					"tasks",
					"title status dueDate project isArchived priority createdAt updatedAt"
				)
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

		// Create last 7 days array with consistent day names
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return date;
		}).reverse();

		// Initialize taskTrendsData with actual day names from last7Days
		const taskTrendsData = last7Days.map((date) => ({
			name: date.toLocaleDateString("en-US", { weekday: "short" }),
			completed: 0,
			inProgress: 0,
			toDo: 0,
		}));

		// Populate task trends data
		for (const project of projects) {
			for (const task of project.tasks as any[]) {
				// Use createdAt or updatedAt - choose based on your needs
				const taskDate = new Date(task.updatedAt); // or task.createdAt

				const dayIndex = last7Days.findIndex((date) => {
					const isSameDay =
						date.getDate() === taskDate.getDate() &&
						date.getMonth() === taskDate.getMonth() &&
						date.getFullYear() === taskDate.getFullYear();

					return isSameDay;
				});

				if (dayIndex !== -1) {
					const status = task.status?.toLowerCase();

					switch (status) {
						case "done":
							taskTrendsData[dayIndex].completed++;
							break;
						case "in progress":
							taskTrendsData[dayIndex].inProgress++;
							break;
						case "to do":
							taskTrendsData[dayIndex].toDo++;
							break;
						default:
							console.log(`Unknown status: ${task.status}`);
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
			switch (task.priority?.toLowerCase()) {
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
				(task: any) =>
					task.status?.toLowerCase() === "done" && task.isArchived === false
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

const acceptTokenInvite = async (req: Request, res: Response) => {
	try {
		const { token } = req.body;
		const decoded = jwt.verify(token, jwtSecret as string);
		const { user, workspaceId, role } = decoded as jwt.JwtPayload & {
			user: string;
			workspaceId: string;
			role?: string;
		};

		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			res.status(404).json({ Message: "Workspace not fond!" });
			return;
		}

		const isMember = workspace.members.some(
			(member) => String(member.user) === String(user)
		);
		if (isMember) {
			res.status(400).json({
				message: "User already a member of this workspace!",
			});
			return;
		}

		const inviteData = await WorkspaceInvite.findOne({
			user: user,
			workspaceId: workspaceId,
		});
		if (!inviteData) {
			res.status(404).json({ Message: "Invite not fond!" });
			return;
		}

		if (inviteData.expiresAt < new Date()) {
			res.status(400).json({ message: "Invitation has expired!" });
			return;
		}

		workspace.members.push({
			user: user,
			role: role || "member",
			joinedAt: new Date(),
		});

		await workspace.save();

		await Promise.all([
			WorkspaceInvite.deleteOne({ _id: inviteData._id }),
			logActivity(user, "joined_workspace", "workspace", workspaceId, {
				description: `Joined ${workspace.name} workspace.`,
			}),
		]);

		res.status(200).json({ message: "Invitation accepted." });
		return;
	} catch (error: any) {
		console.error("Error sending token invite::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const inviteMemberToWorkspace = async (
	req: Request<InviteMemberParams, any, InviteMemberBody>,
	res: Response
): Promise<void> => {
	try {
		const { workspaceId } = req.params;
		const { email, role } = req.body;

		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			res.status(404).json({ Message: "Workspace not fond!" });
			return;
		}

		const user = await getUser(req, res);
		if (!user) return;

		const memberData = workspace.members.find(
			(member) => String(member.user) === String(user.userId)
		);
		if (!memberData || !["admin", "owner"].includes(memberData.role)) {
			res.status(403).json({
				message:
					"You don't have permission to invite others to this workspace!",
			});
			return;
		}

		// find invited member
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			res.status(400).json({ message: "User not found!" });
			return;
		}
		//  check if user is already an  existing member is in workspace
		const isUserAlreadyAMember = workspace.members.some(
			(member) => String(member.user) === String(existingUser._id)
		);
		if (isUserAlreadyAMember) {
			res.status(400).json({
				message: "User already a member of this workspace",
			});
			return;
		}

		// Check to see if invitations were sent already
		const isInvited = await WorkspaceInvite.findOne({
			user: existingUser._id,
			workspaceId: workspaceId,
		});

		if (isInvited && isInvited.expiresAt > new Date()) {
			res
				.status(400)
				.json({ message: "User is already invited to this workspace." });
			return;
		}

		if (isInvited && isInvited.expiresAt < new Date()) {
			await WorkspaceInvite.deleteOne({ _id: isInvited._id });
		}

		if (!jwtSecret || typeof jwtSecret !== "string") {
			res.status(500).json({ message: "JWT secret is not configured." });
			return;
		}

		const inviteToken = jwt.sign(
			{
				user: existingUser._id,
				workspaceId: workspaceId,
				role: role || "member",
			},
			jwtSecret,
			{ expiresIn: "7d" }
		);

		await WorkspaceInvite.create({
			user: existingUser._id,
			workspaceId: workspaceId,
			token: inviteToken,
			role: role || "member",
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		const invitationLink = `${process.env.FRONTEND_URL}/workspace-invite/${workspace._id}?tk=${inviteToken}`;

		const emailContent = `
      <p>You have been invited to join ${workspace.name} workspace</p>
      <p>Click here to join: <a href="${invitationLink}">${invitationLink}</a></p>
    `;

		await sendEmail(
			email,
			"You have been invited to join a workspace",
			emailContent
		);

		res.status(200).json({
			message: "Invitation sent successfully",
		});
		return;
	} catch (error: any) {
		console.error("Error sending email invite::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const acceptGenerateInvitation = async (req: Request, res: Response) => {
	try {
		const { workspaceId } = req.params;

		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			res.status(400).json({ message: "Workspace not found!" });
			return;
		}

		const user = await getUser(req, res);
		if (!user) return;

		const isMember = workspace.members.some(
			(member) => String(member.user) === String(user.userId)
		);
		if (isMember) {
			res
				.status(400)
				.json({ message: "You are already a member of this workspace." });
			return;
		}

		workspace.members.push({
			user: user.userId,
			role: "member",
			joinedAt: new Date(),
		});

		await workspace.save();

		await logActivity(
			user.userId,
			"joined_workspace",
			"Workspace",
			workspaceId,
			{
				description: `Joined ${workspace.name} workspace`,
			}
		);

		res.status(200).json({
			message: "Invitation accepted successfully",
		});
		return;
	} catch (error: any) {
		console.error("Error sending general invite::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const updateWorkspace = async (req: Request, res: Response) => {
	try {
		const { workspaceId } = req.params;
		const { name, description, color } = req.body;

		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			res.status(404).json({ message: "Workspace not found!" });
			return;
		}

		const user = await getUser(req, res);
		if (!user) return;

		const member = workspace.members.find(
			(member) => String(member.user) === String(user.userId)
		);
		if (!member) {
			res
				.status(403)
				.json({ message: "You are not a member of this workspace!" });
			return;
		}
		if (member.role !== "owner") {
			res
				.status(403)
				.json({ message: "Only the workspace owner can update it's details!" });
		}

		workspace.name = name;
		workspace.description = description;
		workspace.color = color;
		await workspace.save();

		logActivity(user.userId, "updated_workspace", "Workspace", workspaceId, {
			description: "Workspace details update.",
		});

		res
			.status(200)
			.json({ message: "Updated workspace details successfully.", workspace });
		return;
	} catch (error) {
		console.error("Error updating workspace::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const deleteWorkspace = async (req: Request, res: Response) => {
	try {
		const { workspaceId } = req.params;

		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			res.status(400).json({ message: "Workspace not found!" });
			return;
		}

		const user = await getUser(req, res);
		if (!user) return;

		const member = workspace.members.find(
			(member) => String(member.user) === String(user.userId)
		);
		if (!member) {
			res
				.status(403)
				.json({ message: "you are not a member of this workspace!" });
			return;
		}
		if (member.role !== "owner") {
			res.status(403).json({
				message: "Only the workspace owner can delete a workspace! ",
			});
			return;
		}

		await workspace.deleteOne();

		logActivity(user.userId, "removed_workspace", "Workspace", workspaceId, {
			description: "Workspace deleted.",
		});
		res.status(200).json({ message: "Workspace deleted successfully." });
		return;
	} catch (error) {
		console.error("Error deleting workspace::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const transferWorkspaceOwnership = async (req: Request, res: Response) => {
	try {
		const { workspaceId } = req.params;
		const { newOwnerId } = req.body;

		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			res.status(400).json({ message: "Workspace not found!" });
			return;
		}

		const user = await getUser(req, res);
		if (!user) return;

		const member = workspace.members.find(
			(member) => String(member.user) === String(user.userId)
		);
		if (!member) {
			res
				.status(403)
				.json({ message: "You are not a member of this workspace!" });
			return;
		}
		const newOwnerIsMember = workspace.members.find(
			(member) => String(member.user) === String(newOwnerId)
		);
		if (!newOwnerIsMember) {
			res
				.status(403)
				.json({ message: "This user is not a member of this workspace!" });
			return;
		}
		if (member.role !== "owner") {
			res.status(403).json({
				message: "Only the workspace owner can transfer workspace ownership! ",
			});
			return;
		}
		if (newOwnerIsMember.role === "owner") {
			res.status(403).json({
				message: "This user is already the owner of this workspace! ",
			});
			return;
		}

		workspace.owner = newOwnerIsMember._id;
		await workspace.save();

		logActivity(
			user.userId,
			"transferred_workspace_ownership",
			"Workspace",
			workspaceId,
			{
				description: `Workspace ownership transfer`,
			}
		);

		res.status(200).json({
			message: "Transferred workspace ownership successfully.",
			workspace,
		});
		return;
	} catch (error) {
		console.error("Error transferring workspace ownership::", error);
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
	acceptTokenInvite,
	inviteMemberToWorkspace,
	acceptGenerateInvitation,
	updateWorkspace,
	deleteWorkspace,
	transferWorkspaceOwnership,
};
