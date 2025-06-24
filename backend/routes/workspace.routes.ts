import express from "express";
import { workspaceSchema } from "../libs/validate-schema";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { createWorkspace } from "../controllers/workspace.controller";

const router = express.Router();

router.post(
	"/create-workspace",
	authMiddleware,
	validateRequest({
		body: workspaceSchema,
	}),
	createWorkspace
);

export default router;
