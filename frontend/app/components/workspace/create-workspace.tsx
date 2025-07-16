import React from "react";
import type { CreateWorkspaceProps } from "@/types";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { colorOptions } from "@/lib";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { FormField as ShadFormField } from "../shared/formfield";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useCreateWorkspace } from "@/hooks/useWorkspace";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export type WorkspaceFormData = z.infer<typeof workspaceSchema>;

const CreateWorkspace = ({
	isCreatingWorkspace,
	setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {
	const { mutate, isPending } = useCreateWorkspace();
	const navigate = useNavigate();

	const form = useForm<WorkspaceFormData>({
		resolver: zodResolver(workspaceSchema),
		defaultValues: {
			name: "",
			color: colorOptions[0],
			description: "",
		},
	});

	const onSubmit = (data: WorkspaceFormData) => {
		mutate(data, {
			onSuccess: (data: any) => {
				form.reset();
				setIsCreatingWorkspace(false);
				toast.success("workspace created successfully");
				navigate(`/workspaces/${data.workspace._id}`);
			},
			onError: (error: any) => {
				console.log("failed creating workspace", error);
				toast.error("Failed to create workspace.");
			},
		});
	};

	return (
		<Dialog
			open={isCreatingWorkspace}
			onOpenChange={setIsCreatingWorkspace}
		>
			<DialogContent className="max-h-[80vh] overflow-y-auto ">
				<DialogHeader>
					<DialogTitle>Create Workspace</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 py-4"
					>
						<ShadFormField
							label="Name"
							name="name"
							type="text"
							placeholder="workspace name"
						/>

						<ShadFormField
							label="Description"
							name="description"
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

						<DialogFooter>
							<Button
								type="submit"
								disabled={isPending}
							>
								{isPending ? "Creating" : "Create"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateWorkspace;
