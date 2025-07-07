import { token } from "morgan";
import { z } from "zod";

const registerSchema = z.object({
	fullname: z.string().min(5, "Name is required").max(100),
	email: z.string().email("invalid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(20, "Password is too long"),
});

const loginSchema = z.object({
	email: z.string().email("invalid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(20, "Password is too long"),
});

const verifyEmailSchema = z.object({
	token: z.string().min(1, "Token is required"),
});

const resetPasswordRequestSchema = z.object({
	email: z.string().email("invalid email address"),
});

const resetPasswordSchema = z.object({
	token: z.string().min(1, "Token is required"),
	newPassword: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(20, "Password is too long"),
	confirmPassword: z
		.string()
		.min(8, "confirm password is required")
		.max(20, "Password is too long"),
});

// WORKSPACE
const workspaceSchema = z.object({
	name: z.string().min(3, "name must be at least 3 characters long"),
	color: z.string().min(3, "Select a color"),
	description: z.string().optional(),
});

// PROJECT
const projectSchema = z.object({
	title: z.string().min(3, "name must be at least 3 characters long"),
	description: z.string().optional(),
	status: z.enum([
		"Planning",
		"In Progress",
		"On Hold",
		"Completed",
		"Cancelled",
	]),
	startDate: z.string().min(10, "Start date is required!"),
	dueDate: z.string().min(10, "Due date is required!"),
	members: z
		.array(
			z.object({
				user: z.string(),
				role: z.enum(["manager", "contributor", "viewer"]),
			})
		)
		.optional(),
	tags: z.string().optional(),
});

const taskSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters long"),
	description: z.string().optional(),
	assignees: z.array(z.string()).min(1, "At least one assignee is required"),
	status: z.enum(["To Do", "In Progress", "Done"]),
	priority: z.enum(["Low", "Medium", "High"]),
	dueDate: z.string().min(1, "Due date is required"),
	projectId: z.string().min(1, "Project ID is required"),
});

export {
	registerSchema,
	loginSchema,
	verifyEmailSchema,
	resetPasswordRequestSchema,
	resetPasswordSchema,
	workspaceSchema,
	projectSchema,
	taskSchema,
};
