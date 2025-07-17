import { Request, Response } from "express";
import Workspace from "../models/workspace";
import { getUser } from "./workspace.controller";
import Project from "../models/projects";
import Task from "../models/task";
import { logActivity } from "../libs";

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

		logActivity(
			user.userId,
			"created_project",
			"Project",
			String(newProject._id),
			{
				description: `Created new project titled ${title}.`,
			}
		);

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

const getArchivedProjectsAndTasks = async (req: Request, res: Response) => {
	try {
		const { workspaceId } = req.params;

		const user = await getUser(req, res);
		if (!user) return;

		const allUserProjects = await Project.find({
			workspace: workspaceId,
			"members.user": user.userId,
		});
		if (!allUserProjects) {
			res.status(400).json({ message: "No archived projects found!" });
			return;
		}

		const archivedProjects = allUserProjects.filter(
			(projects) => projects.isArchived
		);
		// get all project ids
		const projectIds = allUserProjects.map((project) => project._id);

		// get archived tasks
		const archivedTasks = await Task.find({
			project: { $in: projectIds },
			isArchived: true,
		}).populate("project", "title");

		res.status(200).json({ archivedProjects, archivedTasks });
		return;
	} catch (error) {
		console.error("Error getting archived projects::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const archiveProject = async (req: Request, res: Response) => {
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
			(member) => String(member.user) === String(user.userId)
		);
		if (!isMember) {
			res.status(403).json({ message: "You are not a member of this project" });
			return;
		}

		const isProjectArchived = project.isArchived;
		project.isArchived = !isProjectArchived;
		await project.save();

		logActivity(user.userId, "updated_project", "Project", projectId, {
			description: `${
				isProjectArchived ? "Unarchive project." : "Archived project."
			}`,
		});

		res.status(200).json({
			message: `${
				isProjectArchived ? "Unarchive project." : "Archived project."
			}`,
			project,
		});
		return;
	} catch (error) {
		console.error("Error archiving task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

export {
	createProject,
	getProjectDetails,
	getProjectTasks,
	getArchivedProjectsAndTasks,
	archiveProject,
};
