import React from "react";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { signUpSchema } from "@/lib/schema";
import { useSignUpMutation } from "@/hooks/useAuth";
import { toast } from "sonner";

export type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
	const navigate = useNavigate();
	const form = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			fullname: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const { mutate, isPending } = useSignUpMutation();

	const handleSubmit = (data: SignUpFormData) => {
		mutate(data, {
			onSuccess: () => {
				toast.success("Email verification required", {
					description:
						"A verification email was sent to your email. Please check and verify your account.",
				});
				form.reset();
				navigate("/sign-in");
			},
			onError: (error: any) => {
				const errorMsg =
					error.response?.data?.message ||
					error.response?.data?.error ||
					"An error occurred";
				toast.error(errorMsg);
				console.error("Sign up error:", error);
			},
		});
	};

	return (
		<section className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4 ">
			<Card className="max-w-md w-full shadow-xl">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Create an account</CardTitle>
					<CardDescription className="text-muted-foreground">
						Enter your information to create an account.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<FormField
								label="Full Name"
								name="fullname"
								type="text"
								placeholder="John Doe"
							/>
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
							<FormField
								label="Confirm Password"
								name="confirmPassword"
								type="password"
								placeholder="••••••••"
							/>
							<Button
								type="submit"
								className="w-full"
								disabled={isPending}
							>
								{isPending ? "Signing Up..." : "Sign Up"}
							</Button>
						</form>
					</Form>
					<CardFooter>
						<p className="mx-auto text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link
								to="/sign-in"
								className="text-blue-500 font-semibold cursor-pointer hover:underline"
							>
								Sign in
							</Link>
						</p>
					</CardFooter>
				</CardContent>
			</Card>
		</section>
	);
};

export default SignUp;
