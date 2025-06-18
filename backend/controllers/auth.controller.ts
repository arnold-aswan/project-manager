import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user";
import Verification from "../models/verification";
import aj from "../libs/arcjet";
import sendEmail from "../libs/send-email";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
	throw new Error("JWT_SECRET environment variable is not defined");
}

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

		const reason = decision.reason;

		if (reason?.isRateLimit()) {
			res.status(429).json({ error: "Too Many Requests" });
		}

		if (reason?.isBot()) {
			res.status(403).json({ error: "No bots allowed" });
		}

		if (reason?.type === "EMAIL" && decision.conclusion === "DENY") {
			res.status(403).json({
				error: "Disposable, invalid, or unverifiable email",
			});
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

		const verificationToken = jwt.sign(
			{ userId: newUser._id, purpose: "email-verification" },
			jwtSecret,
			{ expiresIn: "1h" }
		);

		await Verification.create({
			userId: newUser._id,
			token: verificationToken,
			expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
		});

		// Send Email
		const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
		const emailContent = `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`;
		const emailSubject = "Email Verification";

		const isEmailSent = await sendEmail(email, emailSubject, emailContent);

		if (!isEmailSent) {
			res.status(500).json({
				message: "Failed to send verification email. Please try again later.",
			});
		}

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
		const { email, password } = req.body;

		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			res.status(401).json({ message: "Invalid credentials" });
			return;
		}
		// Check if email is verified
		if (!user.isEmailVerified) {
			// check for existing email verification
			const existingVerification = await Verification.findOne({
				userId: user._id,
			});

			// check if verification exists and it has not expired yet
			if (existingVerification && existingVerification.expiresAt > new Date()) {
				res.status(400).json({
					message:
						"Email not verified. Please check your email for the verification link.",
				});
				return;
			} else {
				// if verification link has expired delete the old one and send a new one
				if (existingVerification) {
					await Verification.findByIdAndDelete(existingVerification._id);
				}

				const verificationToken = jwt.sign(
					{ userId: user._id, purpose: "email-verification" },
					jwtSecret,
					{ expiresIn: "1h" }
				);

				await Verification.create({
					userId: user._id,
					token: verificationToken,
					expiresAt: new Date(Date.now() + 3600000),
				});

				// Send Email
				const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
				const emailContent = `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`;
				const emailSubject = "Email Verification";

				const isEmailSent = await sendEmail(email, emailSubject, emailContent);

				if (!isEmailSent) {
					res.status(500).json({
						message:
							"Failed to send verification email. Please try again later.",
					});
				}

				res.status(201).json({
					message:
						"A verification email was sent to your email. Please check and verify your account.",
				});
			}
		}
		// Compare passwords
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			res.status(400).json({ message: "Invalid credentials" });
			return;
		}

		const token = jwt.sign({ userId: user._id, purpose: "login" }, jwtSecret, {
			expiresIn: "7d",
		});

		user.lastLogin = new Date();
		await user.save();

		const { password: userPassword, ...userData } = user.toObject();

		res.status(200).json({
			message: "Login successful",
			token,
			user: userData,
		});
	} catch (error) {
		console.error("Error during user login:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const verifyEmailHandler = async (req: Request, res: Response) => {
	try {
		const { token } = req.body;
		if (!token) {
			res.status(401).json({ message: "Unauthorized" });
		}

		const payload = jwt.verify(token, process.env.JWT_SECRET as string);
		if (
			!payload ||
			typeof payload !== "object" ||
			(payload as jwt.JwtPayload).purpose !== "email-verification"
		) {
			res.status(401).json({ message: "Invalid or expired token" });
		}

		let userId;
		if (typeof payload === "object" && "userId" in payload) {
			userId = (payload as jwt.JwtPayload).userId;
		} else {
			res.status(401).json({ message: "Invalid or expired token" });
		}

		const verification = await Verification.findOne({ userId, token });

		if (!verification || verification.expiresAt < new Date()) {
			res.status(401).json({ message: "Unauthorized or expired token" });
		}

		const user = await User.findById(userId);
		if (!user) {
			res.status(401).json({ message: "User not authorized" });
			return;
		}

		if (user.isEmailVerified) {
			res.status(400).json({ message: "Email already verified" });
			return;
		}

		user.isEmailVerified = true;
		await user.save();

		if (verification) {
			await Verification.findByIdAndDelete(verification._id);
		}

		res.status(200).json({ message: "Email verified successfully" });
	} catch (error) {
		console.error("Error during email verification:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export { registerUser, loginUser, verifyEmailHandler };
