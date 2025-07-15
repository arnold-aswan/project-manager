import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import {
	changePassword,
	getUserProfile,
	updateUserProfile,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);

router.put(
	"/profile",
	authMiddleware,
	validateRequest({
		body: z.object({
			fullname: z.string(),
			avatar: z.string().optional(),
		}),
	}),
	updateUserProfile
);

router.put(
	"/profile",
	authMiddleware,
	validateRequest({
		body: z.object({
			currentPassword: z.string(),
			newtPassword: z.string(),
			confirmPassword: z.string(),
		}),
	}),
	changePassword
);

export default router;
