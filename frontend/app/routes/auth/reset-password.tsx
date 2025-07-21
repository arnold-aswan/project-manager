import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { resetPasswordSchema } from "@/lib/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/shared/formfield";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Loader2 } from "@/assets/icons";
import { useResetPasswordMutation } from "@/hooks/useAuth";
import { toast } from "sonner";

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const { mutate, isPending, isSuccess } = useResetPasswordMutation();

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = (data: ResetPasswordFormData) => {
		if (!token) {
			toast.error("Invalid token");
		}

		const payload = { ...data, token };
		mutate(payload, {
			onSuccess: () => {
				toast.success("Password has been reset");
			},
			onError: (error: any) => {
				const errorMsg = "Token expired. Request for a new one.";
				toast.error(errorMsg);
			},
		});
	};

	return (
		<section className="flex flex-col items-center justify-center h-screen">
			<div className="w-full max-w-md space-y-6">
				<div className="flex flex-col items-center justify-center space-y-2">
					<h1 className="text-2xl font-bold">Reset Password</h1>
					<p className="text-sm text-gray-500 ">Enter your new password.</p>
				</div>

				<Card className="w-full mt-4">
					<CardHeader>
						<Link
							to="/sign-in"
							className="flex items-center gap-2"
						>
							<ArrowLeft className="size-4" />
							Back to sign in
						</Link>
					</CardHeader>
					<CardContent className="space-y-1 flex flex-col items-center justify-center">
						{isSuccess ? (
							<>
								<CheckCircle className="size-10 text-green-500" />
								<h3 className="text-2xl font-bold">
									Password reset successful.
								</h3>
							</>
						) : (
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4 w-full"
								>
									<FormField
										label="New Password"
										name="newPassword"
										type="password"
										placeholder="........"
									/>

									<FormField
										label="Confirm Password"
										name="confirmPassword"
										type="password"
										placeholder="........"
									/>

									<Button
										type="submit"
										className="w-full"
										disabled={isPending}
									>
										{isPending ? (
											<Loader2 className="size-4 mr-2 animate-spin" />
										) : (
											"Reset Password"
										)}
									</Button>
								</form>
							</Form>
						)}
					</CardContent>
				</Card>
			</div>
		</section>
	);
};

export default ResetPassword;
