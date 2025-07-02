import { ProjectStatus } from "@/types";
import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
});

export const signUpSchema = z
	.object({
		fullname: z
			.string()
			.min(5, { message: "Full name must be at least 5 characters long" }),
		email: z.string().email({ message: "Invalid email address" }),
		password: z
			.string()
			.min(8, { message: "Password must be at least 6 characters long" }),
		confirmPassword: z
			.string()
			.min(8, { message: "Confirm password is required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const forgotPasswordSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
});

export const resetPasswordSchema = z
	.object({
		newPassword: z
			.string()
			.min(8, { message: "Password must be at least 8 characters long" }),
		confirmPassword: z
			.string()
			.min(8, { message: "Confirm password is required" }),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match!",
		path: ["confirmPassword"],
	});

export const workspaceSchema = z.object({
	name: z.string().min(3, "name must be at least 3 characters long"),
	color: z.string().min(3, "Select a color"),
	description: z.string().optional(),
});

export const projectSchema = z.object({
	title: z.string().min(3, "name must be at least 3 characters long"),
	description: z.string().optional(),
	status: z.nativeEnum(ProjectStatus),
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
