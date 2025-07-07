import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import {
	createTask,
	getTaskById,
	updateTaskAssignees,
	updateTaskDescription,
	updateTaskStatus,
	updateTaskTitle,
} from "../controllers/task.controller";
import { taskSchema } from "../libs/validate-schema";

const router = express.Router();

router.post(
	"/:projectId/create-task",
	authMiddleware,
	validateRequest({
		params: z.object({
			projectId: z.string(),
		}),
		body: taskSchema,
	}),
	createTask
);

router.get(
	"/:taskId",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
	}),
	getTaskById
);

router.put(
	"/:taskId/title",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
		body: z.object({
			title: z.string(),
		}),
	}),
	updateTaskTitle
);

router.put(
	"/:taskId/description",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
		body: z.object({
			description: z.string(),
		}),
	}),
	updateTaskDescription
);

router.put(
	"/:taskId/status",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
		body: z.object({
			status: z.string(),
		}),
	}),
	updateTaskStatus
);

router.put(
	"/:taskId/assignees",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
		body: z.object({
			assignees: z.array(z.string()),
		}),
	}),
	updateTaskAssignees
);

export default router;
