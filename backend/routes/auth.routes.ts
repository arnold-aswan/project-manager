import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
	loginSchema,
	registerSchema,
	verifyEmailSchema,
} from "../libs/validate-schema";
import {
	loginUser,
	registerUser,
	verifyEmailHandler,
} from "../controllers/auth.controller";

const router = express.Router();

router.post(
	"/register",
	validateRequest({
		body: registerSchema,
	}),
	registerUser
);

router.post(
	"/login",
	validateRequest({
		body: loginSchema,
	}),
	loginUser
);

router.post(
	"/verify-email",
	validateRequest({
		body: verifyEmailSchema,
	}),
	verifyEmailHandler
);

export default router;
