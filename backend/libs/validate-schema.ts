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

export {
	registerSchema,
	loginSchema,
	verifyEmailSchema,
	resetPasswordRequestSchema,
	resetPasswordSchema,
};
