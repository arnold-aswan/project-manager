import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import {
	createTask,
	getTaskById,
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
	}),
	updateTaskTitle
);

export default router;
