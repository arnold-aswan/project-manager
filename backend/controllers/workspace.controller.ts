import { Request, Response } from "express";
import Workspace from "../models/workspace";
import Project from "../models/projects";

interface UserWithId {
	userId: string;
	// add other properties if needed
}

const getUser = async (
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
			.populate("tasks", "status")
			.sort({ createdAt: -1 });

		res.status(200).json({ projects, workspace });
	} catch (error) {
		console.error("Error fetching workspace projects::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

export {
	createWorkspace,
	getWorkspaces,
	getWorkspaceDetails,
	getWorkspaceProjects,
};
