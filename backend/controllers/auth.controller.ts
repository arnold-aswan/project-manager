import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user";
import aj from "../libs/arcjet";

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

		const decision = await aj.protect(req, {
			requested: 5,
			email,
		});

		if (decision.reason.isRateLimit()) {
			res.writeHead(429, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "Too Many Requests" }));
		} else if (decision.reason.isBot()) {
			res.writeHead(403, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "No bots allowed" }));
		} else {
			res.writeHead(403, { "Content-Type": "application/json" });
			res.end(
				JSON.stringify({
					error: "Disposable or fake emails are not allowed or Forbidden",
				})
			);
			return;
		}

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

		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			throw new Error("JWT_SECRET environment variable is not defined");
		}
		const verificationToken = jwt.sign(
			{ userId: newUser._id, property: "email-verification" },
			jwtSecret,
			{ expiresIn: "1h" }
		);

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

const verifyEmailHandler = async (req: Request, res: Response) => {
	try {
		const { token } = req.body;
	} catch (error) {
		console.error("Error during email verification:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export { registerUser, loginUser, verifyEmailHandler };
