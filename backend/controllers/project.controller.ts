import { Request, Response } from "express";
import Workspace from "../models/workspace";
import { getUser } from "./workspace.controller";
import Project from "../models/projects";
import Task from "../models/task";

const createProject = async (req: Request, res: Response) => {
	try {
		const { workspaceId } = req.params;
		const { title, description, status, startDate, dueDate, tags, members } =
			req.body;

		const workspace = await Workspace.findById(workspaceId);

		if (!workspace) {
			res.status(404).json({ message: "workspace not found!" });
			return;
		}

		const user = await getUser(req, res);
		if (!user) return;

		const isMember = workspace.members.some(
			(member) => member.user?.toString() === user.userId.toString()
		);

		if (!isMember) {
			res
				.status(403)
				.json({ message: "You are not a member of this workspace" });
			return;
		}

		const tagArray = tags ? tags.split(",") : [];
		const newProject = await Project.create({
			title,
			description,
			status,
			startDate,
			dueDate,
			tags: tagArray,
			workspace: workspaceId,
			members,
			createdBy: user.userId,
		});

		workspace.projects.push(newProject._id);
		await workspace.save();

		res.status(201).json(newProject);
		return;
	} catch (error) {
		console.error("Error creating project::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const getProjectDetails = async (req: Request, res: Response) => {
	try {
		const { projectId } = req.params;
		const project = await Project.findById(projectId);

		if (!project) {
			res.status(404).json({ message: "Project not found!" });
			return;
		}

		const user = await getUser(req, res);
		if (!user) return;

		const isMember = project.members.some(
			(member) => member.user?.toString() === user.userId.toString()
		);

		if (!isMember) {
			res.status(403).json({ message: "You are not a member of this project" });
			return;
		}

		res.status(200).json(project);
		console.log("Project details retrieved successfully::", project);
		return;
	} catch (error) {
		console.error("Error getting project details::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const getProjectTasks = async (req: Request, res: Response) => {
	try {
		const { projectId } = req.params;
		const project = await Project.findById(projectId).populate("members.user");

		if (!project) {
			res.status(404).json({ message: "Project not found!" });
			return;
		}

		const user = await getUser(req, res);
		if (!user) return;

		const isMember = project.members.some(
			(member) => String(member.user?._id) === String(user.userId)
		);

		if (!isMember) {
			res
				.status(403)
				.json({ message: "You are not a member of this project task" });
			return;
		}

		const tasks = await Task.find({
			project: projectId,
			isArchived: false,
		})
			.populate("assignees", "fullname avatar")
			.sort({ createdAt: -1 });

		res.status(200).json({ project, tasks });
		return;
	} catch (error) {
		console.error("Error getting project tasks::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

export { createProject, getProjectDetails, getProjectTasks };
