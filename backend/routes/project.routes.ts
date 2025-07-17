import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "zod-express-middleware";
import { projectSchema } from "../libs/validate-schema";
import { z } from "zod";
import {
	archiveProject,
	createProject,
	getArchivedProjectsAndTasks,
	getProjectDetails,
	getProjectTasks,
} from "../controllers/project.controller";

const router = express.Router();

router.post(
	"/:workspaceId/create-project",
	authMiddleware,

	validateRequest({
		params: z.object({
			workspaceId: z.string(),
		}),
		body: projectSchema,
	}),
	createProject
);

router.post(
	"/:projectId/archive",
	authMiddleware,
	validateRequest({
		params: z.object({
			projectId: z.string(),
		}),
	}),
	archiveProject
);

router.get(
	"/:projectId",
	authMiddleware,
	validateRequest({
		params: z.object({
			projectId: z.string(),
		}),
	}),
	getProjectDetails
);

router.get(
	"/:projectId/tasks",
	authMiddleware,
	validateRequest({
		params: z.object({
			projectId: z.string(),
		}),
	}),
	getProjectTasks
);

router.get(
	"/:workspaceId/archived",
	authMiddleware,
	validateRequest({
		params: z.object({
			workspaceId: z.string(),
		}),
	}),
	getArchivedProjectsAndTasks
);

export default router;
