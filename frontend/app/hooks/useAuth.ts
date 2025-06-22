import { useMutation } from "@tanstack/react-query";
import type { SignUpFormData } from "@/routes/auth/sign-up";
import { postData } from "@/lib/fetch-utils";
import type { SignInFormData } from "@/routes/auth/sign-in";
import type { ForgotPasswordRequestFormData } from "@/routes/auth/forgot-password";
import type { ResetPasswordFormData } from "@/routes/auth/reset-password";

export const useSignUpMutation = () => {
	return useMutation({
		mutationFn: (data: SignUpFormData) => postData("/auth/register", data),
	});
};

export const useVerifyEmailMutation = () => {
	return useMutation({
		mutationFn: (data: { token: string }) =>
			postData("/auth/verify-email", data),
	});
};

export const useLoginMutation = () => {
	return useMutation({
		mutationFn: (data: SignInFormData) => postData("/auth/login", data),
	});
};

export const useForgotPasswordMutation = () => {
	return useMutation({
		mutationFn: (data: ForgotPasswordRequestFormData) =>
			postData("/auth/reset-password-request", data),
	});
};

export const useResetPasswordMutation = () => {
	return useMutation({
		mutationFn: (data: ResetPasswordFormData) =>
			postData("/auth/reset-password", data),
	});
};
