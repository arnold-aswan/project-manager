import { Request, Response } from "express";
import Project from "../models/projects";
import Workspace from "../models/workspace";
import { getUser } from "./workspace.controller";
import Task from "../models/task";
import { logActivity } from "../libs";
import ActivityLog from "../models/activity";
import Comment from "../models/comment";
import mongoose, { Types } from "mongoose";

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

		logActivity(user.userId, "created_task", "Task", String(newTask._id), {
			description: `Created new task titled ${title}.`,
		});

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

const updateTaskDescription = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;
		const { description } = req.body;

		const task = await Task.findById(taskId);
		if (!task) {
			res.status(404).json({ message: "Task not found!" });
			return;
		}

		const project = await Project.findById(task.project);
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

		task.description = description;
		await task.save();

		logActivity(user.userId, "updated_task", "Task", taskId, {
			description: "Task description updated",
		});

		res
			.status(200)
			.json({ message: "Task description updated successfully", task });
		return;
	} catch (error) {
		console.error("Error getting project task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const updateTaskStatus = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;
		const { status } = req.body;

		const task = await Task.findById(taskId);
		if (!task) {
			res.status(404).json({ message: "Task not found!" });
			return;
		}

		const project = await Project.findById(task.project);
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

		task.status = status;
		await task.save();

		logActivity(user.userId, "updated_task", "Task", taskId, {
			description: "Task status updated",
		});

		res.status(200).json({ message: "Task status updated successfully", task });
		return;
	} catch (error) {
		console.error("Error getting project task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const updateTaskAssignees = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;
		const { assignees } = req.body;

		const task = await Task.findById(taskId);
		if (!task) {
			res.status(404).json({ message: "Task not found!" });
			return;
		}

		const project = await Project.findById(task.project);
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

		task.assignees = assignees;
		await task.save();

		logActivity(user.userId, "updated_task", "Task", taskId, {
			description: "Task assignees updated",
		});

		res
			.status(200)
			.json({ message: "Task assignees updated successfully", task });
		return;
	} catch (error) {
		console.error("Error getting project task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const updateTaskPriority = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;
		const { priority } = req.body;

		const task = await Task.findById(taskId);
		if (!task) {
			res.status(404).json({ message: "Task not found!" });
			return;
		}

		const project = await Project.findById(task.project);
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

		task.priority = priority;
		await task.save();

		logActivity(user.userId, "updated_task", "Task", taskId, {
			description: "Task priority updated",
		});

		res
			.status(200)
			.json({ message: "Task priority updated successfully", task });
		return;
	} catch (error) {
		console.error("Error getting project task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const createSubTask = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;
		const { title } = req.body;

		const task = await Task.findById(taskId);
		if (!task) {
			res.status(404).json({ message: "Task not found!" });
			return;
		}

		const project = await Project.findById(task.project);
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

		const newSubTask = {
			title,
			completed: false,
		};

		task.subTasks.push(newSubTask);
		await task.save();

		logActivity(user.userId, "created_subtask", "Task", taskId, {
			description: "Created a new Sub task",
		});

		res.status(200).json({ message: "Sub task created successfully", task });
		return;
	} catch (error) {
		console.error("Error creating sub task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const updateSubTask = async (req: Request, res: Response) => {
	try {
		const { taskId, subTaskId } = req.params;
		const { completed } = req.body;

		const task = await Task.findById(taskId);
		if (!task) {
			res.status(404).json({ message: "Task not found!" });
			return;
		}

		const subTask = task.subTasks.find(
			(subTask) => String(subTask._id) === String(subTaskId)
		);

		if (!subTask) {
			res.status(404).json({ message: "Sub task not found!" });
			return;
		}

		const user = await getUser(req, res);
		if (!user) return;

		subTask.completed = completed;
		await task.save();

		logActivity(user.userId, "updated_subtask", "Task", taskId, {
			description: "Updated Sub task task",
		});

		res.status(200).json({ message: "Sub task updated successfully", task });
		return;
	} catch (error) {
		console.error("Error updating sub task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const getActivityByResourceId = async (req: Request, res: Response) => {
	try {
		const { resourceId } = req.params;

		const activity = await ActivityLog.find({ resourceId })
			.populate("user", "fullname avatar")
			.sort({ createdAt: -1 });

		res.status(200).json(activity);
		return;
	} catch (error) {
		console.error("Error getting activity::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const getCommentsByTaskId = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;

		const comments = await Comment.find({ task: taskId })
			.populate("author", "fullname avatar")
			.sort({ created: -1 })
			.limit(20);

		res.status(200).json(comments);
	} catch (error) {
		console.error("Error fetching comments::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const addComment = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;
		const { text } = req.body;

		const task = await Task.findById(taskId);
		if (!task) {
			res.status(404).json({ message: "Task not found!" });
			return;
		}

		const project = await Project.findById(task.project);
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

		const newComment = await Comment.create({
			text,
			task: taskId,
			author: user.userId,
		});

		task.comments.push(newComment._id);
		await task.save();

		logActivity(user.userId, "added_comment", "Task", taskId, {
			description: "Added a comment",
		});

		res.status(200).json({ message: "Comment added successfully", task });
		return;
	} catch (error) {
		console.error("Error creating comment::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const watchTask = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;

		const task = await Task.findById(taskId);
		if (!task) {
			res.status(404).json({ message: "Task not found!" });
			return;
		}

		const project = await Project.findById(task.project);
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

		const userId = new mongoose.Types.ObjectId(user.userId);
		const isWatching = task.watchers.includes(userId);
		if (!isWatching) {
			task.watchers.push(userId);
		} else {
			task.watchers = task.watchers.filter(
				(watcher) => String(watcher) !== String(user.userId)
			);
		}

		await task.save();

		logActivity(user.userId, "updated_task", "Task", taskId, {
			description: `${
				isWatching ? "Stopped watching task." : "Started watching task."
			}`,
		});

		res.status(200).json({
			message: `${
				isWatching ? "Stopped watching task." : "Started watching task."
			}`,
			task,
		});
		return;
	} catch (error) {
		console.error("Error watching task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const archiveTask = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;

		const task = await Task.findById(taskId);
		if (!task) {
			res.status(404).json({ message: "Task not found!" });
			return;
		}

		const project = await Project.findById(task.project);
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

		const isTaskArchived = task.isArchived;
		task.isArchived = !isTaskArchived;
		await task.save();

		logActivity(user.userId, "updated_task", "Task", taskId, {
			description: `${isTaskArchived ? "Unarchive task." : "Archived task."}`,
		});

		res.status(200).json({
			message: `${isTaskArchived ? "Unarchive task." : "Archived task."}`,
			task,
		});
		return;
	} catch (error) {
		console.error("Error archiving task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

const myTasks = async (req: Request, res: Response) => {
	try {
		const user = await getUser(req, res);
		if (!user) return;

		const myTasks = await Task.find({ assignees: { $in: [user.userId] } })
			.populate("project", "title workspace")
			.sort({ createdAt: -1 });
		res.status(200).json(myTasks);
		return;
	} catch (error) {
		console.error("Error fetching task::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

export {
	createTask,
	getTaskById,
	updateTaskTitle,
	updateTaskDescription,
	updateTaskStatus,
	updateTaskAssignees,
	updateTaskPriority,
	createSubTask,
	updateSubTask,
	getActivityByResourceId,
	getCommentsByTaskId,
	addComment,
	watchTask,
	archiveTask,
	myTasks,
};
