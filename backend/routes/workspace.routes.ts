import express from "express";
import { inviteMemberSchema, workspaceSchema } from "../libs/validate-schema";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import {
	createWorkspace,
	getWorkspaceDetails,
	getWorkspaceProjects,
	getWorkspaces,
	getWorkspaceStats,
	acceptTokenInvite,
	inviteMemberToWorkspace,
	acceptGenerateInvitation,
	updateWorkspace,
	deleteWorkspace,
	transferWorkspaceOwnership,
} from "../controllers/workspace.controller";
import { z } from "zod";

const router = express.Router();

router.post(
	"/create-workspace",
	authMiddleware,
	validateRequest({
		body: workspaceSchema,
	}),
	createWorkspace
);

router.post(
	"/accept-invite-token",
	authMiddleware,
	validateRequest({ body: z.object({ token: z.string() }) }),
	acceptTokenInvite
);

router.post(
	"/:workspaceId/invite-member",
	authMiddleware,
	validateRequest({
		params: z.object({ workspaceId: z.string() }),
		body: inviteMemberSchema,
	}),
	inviteMemberToWorkspace
);

router.post(
	"/:workspaceId/accept-generate-invite",
	authMiddleware,
	validateRequest({
		params: z.object({ workspaceId: z.string() }),
	}),
	acceptGenerateInvitation
);

// PUT
router.put(
	"/:workspaceId/update-workspace",
	authMiddleware,
	validateRequest({
		params: z.object({ workspaceId: z.string() }),
		body: workspaceSchema,
	}),
	updateWorkspace
);

router.put(
	"/:workspaceId/transfer-workspace-ownership",
	authMiddleware,
	validateRequest({
		params: z.object({ workspaceId: z.string() }),
		body: z.object({ newOwnerId: z.string() }),
	}),
	transferWorkspaceOwnership
);

// DELETE
router.delete(
	"/:workspaceId/delete-workspace",
	authMiddleware,
	validateRequest({
		params: z.object({ workspaceId: z.string() }),
	}),
	deleteWorkspace
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);

export default router;
