import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import {
	addComment,
	archiveTask,
	createSubTask,
	createTask,
	getActivityByResourceId,
	getCommentsByTaskId,
	getTaskById,
	myTasks,
	updateSubTask,
	updateTaskAssignees,
	updateTaskDescription,
	updateTaskPriority,
	updateTaskStatus,
	updateTaskTitle,
	watchTask,
} from "../controllers/task.controller";
import { taskSchema } from "../libs/validate-schema";

const router = express.Router();

//  GET
router.get("/my-tasks", authMiddleware, myTasks);

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

router.get(
	"/:resourceId/activity",
	authMiddleware,
	validateRequest({
		params: z.object({
			resourceId: z.string(),
		}),
	}),
	getActivityByResourceId
);

router.get(
	"/:taskId/comments",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
	}),
	getCommentsByTaskId
);

// POST
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

router.post(
	"/:taskId/add-subtask",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
		body: z.object({
			title: z.string(),
		}),
	}),
	createSubTask
);

router.post(
	"/:taskId/add-comment",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
		body: z.object({
			text: z.string(),
		}),
	}),
	addComment
);

router.post(
	"/:taskId/watch",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
	}),
	watchTask
);

router.post(
	"/:taskId/archive",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
	}),
	archiveTask
);

// PUT
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

router.put(
	"/:taskId/priority",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
		body: z.object({
			priority: z.string(),
		}),
	}),
	updateTaskPriority
);

router.put(
	"/:taskId/update-subtask/:subTaskId",
	authMiddleware,
	validateRequest({
		params: z.object({
			taskId: z.string(),
		}),
		body: z.object({
			completed: z.boolean(),
		}),
	}),
	updateSubTask
);

export default router;
