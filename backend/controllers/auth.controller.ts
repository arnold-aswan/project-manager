import { Response, Request } from "express";
import bcrypt from "bcrypt";

import User from "../models/user";

export const hashPassword = async (password: string): Promise<string> => {
	try {
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		return hashedPassword;
	} catch (error) {
		console.error("Error hashing password:", error);
		throw new Error("Password hashing failed");
	}
};

const registerUser = async (req: Request, res: Response) => {
	try {
		const { fullname, email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400).json({ message: "User already exists" });
		}

		const hashedPassword = await hashPassword(password);
		const newUser = await User.create({
			email,
			password: hashedPassword,
			fullname,
		});
		// TODO: Implement email verification logic here
		// For example, send a verification email with a token
		res.status(201).json({
			message:
				"A verification email was sent to your email. Please check and verify your account.",
		});
	} catch (error) {
		console.error("Error during user registration:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const loginUser = async (req: Request, res: Response) => {
	try {
		// Implement login logic here
	} catch (error) {
		console.error("Error during user login:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export { registerUser, loginUser };
