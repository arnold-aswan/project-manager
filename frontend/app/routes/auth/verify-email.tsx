import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router";

import {
	ArrowLeft,
	CheckCircle,
	Loader2,
	XCircle,
} from "../../../public/icons";
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/hooks/useAuth";
import { toast } from "sonner";

const VerifyEmail = () => {
	const [searchParams] = useSearchParams();

	const [isSuccess, setIsSuccess] = useState(false);
	const { mutate, isPending } = useVerifyEmailMutation();

	useEffect(() => {
		const token = searchParams.get("token");
		if (!token) {
			setIsSuccess(false);
		} else {
			mutate(
				{ token },
				{
					onSuccess: () => {
						setIsSuccess(true);
					},
					onError: (error: any) => {
						const errorMsg =
							error?.response?.data?.message || "An error occurred";
						setIsSuccess(false);
						toast.error(errorMsg);
					},
				}
			);
		}
	}, [searchParams]);

	return (
		<section className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold">Verify email</h1>
			<p className="text-sm text-gray-500 "> Verifying your email...</p>

			<Card className="w-full max-w-md mt-4">
				<CardContent>
					<article className="flex flex-col items-center justify-center py-6">
						{isPending ? (
							<>
								<Loader2 className="size-10 animate-spin text-blue-500" />
								<h3>Verifying Email</h3>
								<p>Please wait as we verify your email</p>
							</>
						) : isSuccess ? (
							<>
								<CheckCircle className="size-10 text-green-500" />
								<h3 className="text-2xl font-bold">Email Verified</h3>
								<p className="text-sm text-gray-50s0">
									Your email was verified successfully.
								</p>
								<Link
									to="/sign-in"
									className="flex items-center gap-4 mt-4"
								>
									<Button
										variant="outline"
										className="text-blue-500"
									>
										<ArrowLeft className="size-4 text-blue-500" />
										Back to sign in
									</Button>
								</Link>
							</>
						) : (
							<>
								<XCircle className="size-10 text-red-500" />
								<h3 className="text-2xl font-bold">
									Email Verification Failed!
								</h3>
								<p className="text-sm text-gray-50z0">
									Email verification failed. Please try again later.
								</p>

								<Link
									to="/sign-in"
									className="flex items-center gap-4 mt-4"
								>
									<Button
										variant="outline"
										className="text-blue-500"
									>
										<ArrowLeft className="size-4 text-blue-500" />
										Back to sign in
									</Button>
								</Link>
							</>
						)}
					</article>
				</CardContent>
			</Card>
		</section>
	);
};

export default VerifyEmail;
