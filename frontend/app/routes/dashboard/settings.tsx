import Loader from "@/components/shared/loader";
import {
	useGetWorkspaceDetailsQuery,
	useUpdateWorkspaceDetailsMutation,
} from "@/hooks/useWorkspace";
import { useSearchParams } from "react-router";

import { useForm } from "react-hook-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Settings as SettingsIcon } from "@/assets/icons";

import type { WorkspaceFormData } from "@/components/workspace/create-workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceSchema } from "@/lib/schema";
import { colorOptions } from "@/lib";
import type { MemberProps, Workspace } from "@/types";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { FormField as ShadFormField } from "@/components/shared/formfield";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useAuthStore from "@/stores/authstore";
import DeleteWorkspace from "@/components/modals/DeleteWorkspace";
import TransferWorkspace from "@/components/modals/TransferWorkspace";
import { toast } from "sonner";

const Settings = () => {
	const [searchParams] = useSearchParams();
	const workspaceId = searchParams.get("workspaceId");
	const { user } = useAuthStore.getState();
	const [isDeletingWorkspace, setIsDeletingWorkspace] = useState(false);
	const [isTransferringWorkspace, setIsTransferringWorkspace] = useState(false);

	const { data: workspace, isPending } = useGetWorkspaceDetailsQuery(
		workspaceId!
	) as {
		data: Workspace;
		isPending: boolean;
	};
	const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
		useUpdateWorkspaceDetailsMutation();

	const form = useForm<WorkspaceFormData>({
		resolver: zodResolver(workspaceSchema),
		defaultValues: {
			name: "",
			description: "",
			color: colorOptions[0],
		},
	});

	useEffect(() => {
		if (workspace) {
			form.reset({
				name: workspace.name,
				description: workspace.description,
				color: workspace.color ?? colorOptions[0],
			});
		}
	}, [workspace, form]);

	const isOwner = String(user?._id) === String(workspace?.owner);

	const onSubmit = (data: WorkspaceFormData) => {
		if (!workspaceId) return;
		updateWorkspace(
			{
				workspaceData: data,
				workspaceId,
			},
			{
				onSuccess: (data: any) => {
					toast.success(data.message);
					form.reset({
						name: data.workspace.name,
						description: data.workspace.description,
						color: data.workspace.color,
					});
				},
				onError: (error: any) => {
					toast.error("Uh oh, failed to update workspace details.");
					console.error(error);
				},
			}
		);
	};

	if (!workspaceId) return <div>No workspace selected</div>;
	if (isPending) return <Loader />;

	return (
		<section className="space-y-8 container max-w-3xl mx-auto">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<SettingsIcon />
						<h4 className="text-xl font-bold">Workspace Settings.</h4>
					</CardTitle>
					<CardDescription>
						<p className="text-muted-foreground text-sm ">
							Manage your workspace settings and preferences.
						</p>
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6 py-4"
						>
							<ShadFormField
								name="name"
								label="workspace name"
								type="text"
								placeholder="workspace name"
							/>

							<ShadFormField
								name="description"
								label="workspace description"
								type="textarea"
								placeholder="workspace description"
							/>

							<FormField
								control={form.control}
								name="color"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Color</FormLabel>
										<FormControl>
											<div className="flex gap-3 flex-wrap">
												{colorOptions.map((color) => (
													<div
														key={color}
														onClick={() => field.onChange(color)}
														className={cn(
															"size-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300",
															field.value === color &&
																"ring-2 ring-offset-2 ring-blue-500"
														)}
														style={{ backgroundColor: color }}
													></div>
												))}
											</div>
										</FormControl>
									</FormItem>
								)}
							/>
							<CardFooter>
								<Button
									type="submit"
									variant={"default"}
									disabled={isPending}
									className="ml-auto "
								>
									{isUpdatingWorkspace ? "Saving Changes..." : "Save Changes"}
								</Button>
							</CardFooter>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Transfer Workspace</CardTitle>
					<CardDescription>
						Transfer ownership of this workspace to another member.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						variant={"secondary"}
						onClick={() => setIsTransferringWorkspace(true)}
						disabled={!isOwner}
					>
						Transfer Workspace
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-xl font-bold text-red-500">
						Danger Zone
					</CardTitle>
					<CardDescription>
						Irreversible actions for your workspace.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						variant={"destructive"}
						disabled={!isOwner}
						onClick={() => setIsDeletingWorkspace(true)}
					>
						Delete Workspace
					</Button>
				</CardContent>
			</Card>

			<TransferWorkspace
				workspaceId={workspaceId}
				workspaceMembers={(workspace?.members as MemberProps[]) || []}
				isTransferringWorkspace={isTransferringWorkspace}
				setIsTransferringWorkspace={setIsTransferringWorkspace}
			/>

			<DeleteWorkspace
				workspaceId={workspaceId}
				isDeletingWorkspace={isDeletingWorkspace}
				setIsDeletingWorkspace={setIsDeletingWorkspace}
			/>
		</section>
	);
};

export default Settings;
