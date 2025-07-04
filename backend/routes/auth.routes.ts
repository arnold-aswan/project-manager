import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
	loginSchema,
	registerSchema,
	verifyEmailSchema,
	resetPasswordSchema,
	resetPasswordRequestSchema,
} from "../libs/validate-schema";
import {
	loginUser,
	registerUser,
	resetPasswordRequest,
	verifyEmailHandler,
	verifyResetPasswordTokenAndResetPassword,
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

router.post(
	"/reset-password-request",
	validateRequest({
		body: resetPasswordRequestSchema,
	}),
	resetPasswordRequest
);

router.post(
	"/reset-password",
	validateRequest({
		body: resetPasswordSchema,
	}),
	verifyResetPasswordTokenAndResetPassword
);

export default router;
