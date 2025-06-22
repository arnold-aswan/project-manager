import React from "react";
import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/schema";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/formfield";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "@/assets/icons";
import useAuthStore from "@/stores/authstore";
import type { User } from "@/types";

export type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
	const navigate = useNavigate();
	const form = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { mutate, isPending } = useLoginMutation();
	const { loginSuccess } = useAuthStore.getState();

	const handleSubmit = (data: SignInFormData) => {
		console.log(data);
		mutate(data, {
			onSuccess: (data) => {
				const userData = data as { user: User };
				loginSuccess(userData.user);
				toast.success("logged in successfully");
				navigate("/dashboard");
			},
			onError: (error: any) => {
				const errorMsg =
					error.response?.data?.message ||
					error.response?.data?.error ||
					"An error occurred";
				toast.error(errorMsg);
			},
		});
	};

	return (
		<section className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4 ">
			<Card className="max-w-md w-full shadow-xl">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Welcome back</CardTitle>
					<CardDescription className="text-muted-foreground">
						Sign in to your account to continue.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<FormField
								label="Email"
								name="email"
								type="email"
								placeholder="email@example.com"
							/>
							<FormField
								label="Password"
								name="password"
								type="password"
								placeholder="••••••••"
							/>

							<Link
								to="/forgot-password"
								className="text-blue-500 text-xs hover:underline block "
							>
								Forgot password?
							</Link>
							<Button
								type="submit"
								className="w-full"
								disabled={isPending}
							>
								{isPending ? (
									<>
										<Loader2 className="size-4 mr-2" />
										Signing in...
									</>
								) : (
									"Sign In"
								)}
							</Button>
						</form>
					</Form>
					<CardFooter>
						<p className="mx-auto text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<Link
								to="/sign-up"
								className="text-blue-500 font-semibold cursor-pointer hover:underline"
							>
								Sign up
							</Link>
						</p>
					</CardFooter>
				</CardContent>
			</Card>
		</section>
	);
};

export default SignIn;
