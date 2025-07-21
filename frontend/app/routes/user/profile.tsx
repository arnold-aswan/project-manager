import BackButton from "@/components/shared/back-button";
import { FormField } from "@/components/shared/formfield";
import Loader from "@/components/shared/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	useChangePassword,
	useUpdateUserProfile,
	useGetUserProfileQuery,
} from "@/hooks/useProfile";
import {
	changePasswordSchema,
	profileSchema,
	type ChangePasswordFormData,
	type ProfileFormData,
} from "@/lib/schema";
import useAuthStore from "@/stores/authstore";
import type { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "@/assets/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Profile = () => {
	const { data: user, isPending } = useGetUserProfileQuery() as {
		data: User;
		isPending: boolean;
	};

	const { logout } = useAuthStore();
	const navigate = useNavigate();

	const form = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const profileForm = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			fullname: user?.fullname || "",
			avatar: user?.avatar || "",
		},
		values: {
			fullname: user?.fullname || "",
			avatar: user?.avatar || "",
		},
	});

	const { mutate: updateUserProfile, isPending: isUpdatingProfile } =
		useUpdateUserProfile();
	const {
		mutate: changePassword,
		isPending: isChangingPassword,
		error,
	} = useChangePassword();

	const handlePasswordChange = (data: ChangePasswordFormData) => {
		changePassword(data, {
			onSuccess: () => {
				toast.success(
					"Password updated successfully. You will be logged out. Please login again."
				);
				form.reset();

				setTimeout(() => {
					logout();
					navigate("/sign-in");
				}, 3000);
			},
			onError: (error: any) => {
				const errorMessage =
					error.response?.data?.error || "Failed to update password";
				toast.error(errorMessage);
				console.error(error);
			},
		});
	};

	const handleProfileFormSubmit = (data: ProfileFormData) => {
		updateUserProfile(
			{ fullname: data.fullname, avatar: data.avatar || "" },
			{
				onSuccess: () => {
					toast.success("Profile updated successfully");
				},
				onError: (error: any) => {
					const errorMessage =
						error.response?.data?.error || "Failed to update profile";
					toast.error(errorMessage);
				},
			}
		);
	};

	if (isPending) return <Loader />;
	if (!user) return <div>User not found</div>;

	return (
		<section className="space-y-8">
			<header className="px-4 md:px-0">
				<BackButton />
				<h3 className="text-lg font-medium">Profile Information</h3>
				<p className="text-sm text-muted-foreground">
					Manage your account settings and preferences.
				</p>
			</header>

			<Separator />

			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
					<CardDescription>Update your personal details.</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...profileForm}>
						<form
							onSubmit={profileForm.handleSubmit(handleProfileFormSubmit)}
							className="grid gap-4"
						>
							<div className="flex items-center space-x-4 mb-6">
								<Avatar className="h-20 w-20 bg-gray-600">
									<AvatarImage
										src={profileForm.watch("avatar") || user?.avatar}
										alt={user?.fullname}
									/>
									<AvatarFallback className="text-xl">
										{user?.fullname?.charAt(0).toUpperCase() || "U"}
									</AvatarFallback>
								</Avatar>
								<div>
									<input
										id="avatar-upload"
										type="file"
										accept="image/*"
										// onChange={handleAvatarChange}
										// disabled={uploading || isUpdatingProfile}
										style={{ display: "none" }}
									/>
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() =>
											document.getElementById("avatar-upload")?.click()
										}
										// disabled={uploading || isUpdatingProfile}
									>
										Change Avatar
									</Button>
								</div>
							</div>

							<FormField
								label="Full  Name"
								name="fullname"
								type="text"
								placeholder="john doe"
							/>

							<div className="grid gap-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									defaultValue={user?.email}
									disabled
								/>
								<p className="text-xs text-muted-foreground">
									Your email address cannot be changed.
								</p>
							</div>
							<Button
								type="submit"
								className="w-fit"
								disabled={isUpdatingProfile || isPending}
							>
								{isUpdatingProfile ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									"Save Changes"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Security</CardTitle>
					<CardDescription>Update your password.</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handlePasswordChange)}
							className="grid gap-4"
						>
							{error && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{error.message}</AlertDescription>
								</Alert>
							)}

							<div className="grid gap-2">
								<FormField
									label="current password"
									name="currentPassword"
									type="password"
									placeholder="*******"
								/>

								<FormField
									label="new password"
									name="newPassword"
									type="password"
									placeholder="*******"
								/>

								<FormField
									label="confirm password"
									name="confirmPassword"
									type="password"
									placeholder="*******"
								/>
							</div>

							<Button
								type="submit"
								className="mt-2 w-fit"
								disabled={isPending || isChangingPassword}
							>
								{isPending || isChangingPassword ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Updating...
									</>
								) : (
									"Update Password"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</section>
	);
};

export default Profile;
