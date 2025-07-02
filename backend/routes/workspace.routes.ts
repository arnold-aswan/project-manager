import express from "express";
import { workspaceSchema } from "../libs/validate-schema";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import {
	createWorkspace,
	getWorkspaceDetails,
	getWorkspaceProjects,
	getWorkspaces,
} from "../controllers/workspace.controller";

const router = express.Router();

router.post(
	"/create-workspace",
	authMiddleware,
	validateRequest({
		body: workspaceSchema,
	}),
	createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);

export default router;
