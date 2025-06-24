import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";

declare global {
	namespace Express {
		interface Request {
			user?: string | JwtPayload | typeof User | null;
		}
	}
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
	throw new Error("JWT_SECRET environment variable is not defined");
}

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.cookies?.token;

		if (!token) {
			res.status(401).json({ message: "Unauthorized! No token provided." });
			return;
		}

		const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
		req.user = decoded;
		next();
	} catch (error) {
		console.error("JWT error:", error);
		res.status(401).json({ message: "Invalid or expired token" });
		return;
	}
};
