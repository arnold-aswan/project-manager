import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2 } from "@/assets/icons";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormField } from "@/components/shared/formfield";
import { useForgotPasswordMutation } from "@/hooks/useAuth";

export type ForgotPasswordRequestFormData = z.infer<
	typeof forgotPasswordSchema
>;

const ForgotPassword = () => {
	const { mutate, isPending, isSuccess } = useForgotPasswordMutation();

	const form = useForm<ForgotPasswordRequestFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = (data: ForgotPasswordRequestFormData) => {
		mutate(data, {
			onSuccess: () => {
				toast.success("A password reset link has been sent to your email.");
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
		<section className="flex flex-col items-center justify-center h-screen">
			<div className="w-full max-w-md space-y-6">
				<div className="flex flex-col items-center justify-center space-y-2">
					<h1 className="text-2xl font-bold">Forgot Password</h1>
					<p className="text-sm text-muted-foreground ">
						Enter your email to reset your password
					</p>

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
										Password reset email sent.
									</h3>
									<p className="text-sm text-muted-foreground">
										Check your email for a password reset link.
									</p>
								</>
							) : (
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="w-full space-y-4"
									>
										<FormField
											label="Email"
											name="email"
											type="email"
											placeholder="email@example.com"
										/>

										<Button
											type="submit"
											className="w-full"
											disabled={isPending}
										>
											{isPending ? (
												<Loader2 className="size-4 mr-2 animate-spin" />
											) : (
												"Send Reset Link"
											)}
										</Button>
									</form>
								</Form>
							)}
						</CardContent>
						<CardFooter className=" mx-auto">
							<p>
								Remember your password?{" "}
								<Link
									to="/sign-in"
									className="font-bold text-blue-500 hover:underline"
								>
									Sign in
								</Link>
							</p>
						</CardFooter>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default ForgotPassword;
