import { Request, Response } from "express";
import Project from "../models/projects";
import Workspace from "../models/workspace";
import { getUser } from "./workspace.controller";
import Task from "../models/task";
import { logActivity } from "../libs";

const createTask = async (req: Request, res: Response) => {
	try {
		const { projectId } = req.params;
		const { title, description, assignees, status, priority, dueDate } =
			req.body;

		const project = await Project.findById(projectId);
		if (!project) {
			res.status(404).json({ message: "Project not found!" });
			return;
		}

		const workspace = await Workspace.findById(project.workspace);
		if (!workspace) {
			res.status(404).json({ message: "Workspace not found!" });
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
				.json({ message: "You are not a member of this workspace" });
			return;
		}

		const newTask = await Task.create({
			title,
			description,
			assignees,
			status,
			priority,
			dueDate,
			createdBy: user.userId,
			project: projectId,
		});

		project.tasks.push(newTask._id);
		await project.save();

		res.status(201).json(newTask);
		return;
	} catch (error) {
		console.error("Error creating project task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const getTaskById = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;

		const task = await Task.findById(taskId)
			.populate("assignees", "fullname avatar")
			.populate("watchers", "fullname avatar");

		if (!task) {
			res.status(404).json({ message: "Task not found!" });
			return;
		}

		const project = await Project.findById(task.project).populate(
			"members.user",
			"fullname avatar"
		);

		if (!project) {
			res.status(404).json({ message: "Project not found!" });
			return;
		}

		res.status(200).json({ task, project });
		return;
	} catch (error) {
		console.error("Error getting project task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const updateTaskTitle = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;
		const { title } = req.body;

		const task = await Task.findById(taskId);
		if (!task) {
			res.status(404).json({ message: "Task not found!" });
			return;
		}

		const project = await Project.findById(task?.project);
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

		task.title = title;
		await task.save();

		// Log activity
		await logActivity(user.userId, "updated_task", "Task", taskId, {
			description: `Task title updated`,
		});
		res.status(200).json({ message: "Task title updated successfully", task });
		return;
	} catch (error) {
		console.error("Error getting project task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

export { createTask, getTaskById, updateTaskTitle };
