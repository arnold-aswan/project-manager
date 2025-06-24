import { Request, Response } from "express";
import Workspace from "../models/workspace";

interface UserWithId {
	userId: string;
	// add other properties if needed
}

const createWorkspace = async (req: Request, res: Response) => {
	try {
		const { name, description, color } = req.body;

		const user = req.user as UserWithId | undefined;

		if (!user || !user.userId) {
			res.status(401).json({ message: "Unauthorized: User not found" });
			return;
		}

		const workspace = await Workspace.create({
			name,
			description,
			color,
			owner: user.userId,
			members: [
				{
					user: user.userId,
					role: "owner",
					joinedAt: Date.now(),
				},
			],
		});

		res
			.status(201)
			.json({ message: "workspace created successfully", workspace });
		return;
	} catch (error) {
		console.error("Error creating workspace::", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};

export { createWorkspace };
