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
import { Link } from "react-router";

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
	const form = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSubmit = (data: SignInFormData) => {
		console.log(data);
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
							<Button
								type="submit"
								className="w-full"
							>
								Sign In
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
