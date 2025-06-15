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

export { registerSchema, loginSchema };
